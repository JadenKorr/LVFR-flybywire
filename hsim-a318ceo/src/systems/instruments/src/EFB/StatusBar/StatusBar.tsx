// Copyright (c) 2022 FlyByWire Simulations
// SPDX-License-Identifier: GPL-3.0

import React, { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff } from 'react-bootstrap-icons';
import { useSimVar, usePersistentNumberProperty, usePersistentProperty } from '@flybywiresim/fbw-sdk';
import { useInterval } from '@flybywiresim/react-components';
import { ClientState } from '@simbridge/index';
import { t } from '../translation';
import { TooltipWrapper } from '../UtilComponents/TooltipWrapper';
import { BatteryStatus } from './BatteryStatus';
import { useAppSelector } from '../Store/store';
import { initialState } from '../Store/features/simBrief';
import { QuickControls } from './QuickControls';

interface StatusBarProps {
    batteryLevel: number;
    isCharging: boolean;
}

export const StatusBar = ({ batteryLevel, isCharging }: StatusBarProps) => {
    const [currentUTC] = useSimVar('E:ZULU TIME', 'seconds');
    const [currentLocalTime] = useSimVar('E:LOCAL TIME', 'seconds');
    const [dayOfWeek] = useSimVar('E:ZULU DAY OF WEEK', 'number');
    const [monthOfYear] = useSimVar('E:ZULU MONTH OF YEAR', 'number');
    const [dayOfMonth] = useSimVar('E:ZULU DAY OF MONTH', 'number');
    const [showStatusBarFlightProgress] = usePersistentNumberProperty('EFB_SHOW_STATUSBAR_FLIGHTPROGRESS', 1);

    const [timeDisplayed] = usePersistentProperty('EFB_TIME_DISPLAYED', 'utc');
    const [timeFormat] = usePersistentProperty('EFB_TIME_FORMAT', '24');

    const [outdatedVersionFlag] = useSimVar('L:A318HS_OUTDATED_VERSION', 'boolean', 500);

    const dayName = [
        t('StatusBar.Sun'),
        t('StatusBar.Mon'),
        t('StatusBar.Tue'),
        t('StatusBar.Wed'),
        t('StatusBar.Thu'),
        t('StatusBar.Fri'),
        t('StatusBar.Sat'),
    ][dayOfWeek];

    const monthName = [
        t('StatusBar.Jan'),
        t('StatusBar.Feb'),
        t('StatusBar.Mar'),
        t('StatusBar.Apr'),
        t('StatusBar.May'),
        t('StatusBar.Jun'),
        t('StatusBar.Jul'),
        t('StatusBar.Aug'),
        t('StatusBar.Sep'),
        t('StatusBar.Oct'),
        t('StatusBar.Nov'),
        t('StatusBar.Dec'),
    ][monthOfYear - 1];

    const getZuluFormattedTime = (seconds: number) => `${Math.floor(seconds / 3600).toString().padStart(2, '0')}${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}Z`;
    const getLocalFormattedTime = (seconds: number) => {
        if (timeFormat === '24') {
            return `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}`;
        }
        const hours = Math.floor(seconds / 3600) % 12;
        const minutes = Math.floor((seconds % 3600) / 60);
        const ampm = Math.floor(seconds / 3600) >= 12 ? 'pm' : 'am';
        return `${hours === 0 ? 12 : hours}:${minutes.toString().padStart(2, '0')}${ampm}`;
    };

    const { flightPlanProgress } = useAppSelector((state) => state.flightProgress);
    const { departingAirport, arrivingAirport, schedIn, schedOut } = useAppSelector((state) => state.simbrief.data);
    const { data } = useAppSelector((state) => state.simbrief);

    const [showSchedTimes, setShowSchedTimes] = useState(false);

    let schedInParsed = '';
    let schedOutParsed = '';

    if (!schedInParsed) {
        const sta = new Date(parseInt(schedIn) * 1000);
        schedInParsed = `${sta.getUTCHours().toString().padStart(2, '0')}${sta.getUTCMinutes().toString().padStart(2, '0')}Z`;
    }

    if (!schedOutParsed) {
        const std = new Date(parseInt(schedOut) * 1000);
        schedOutParsed = `${std.getUTCHours().toString().padStart(2, '0')}${std.getUTCMinutes().toString().padStart(2, '0')}Z`;
    }
    const shutoffTimerRef = useRef<NodeJS.Timer | null>(null);

    const [simBridgeConnected, setSimBridgeConnected] = useState(false);

    useInterval(() => {
        setSimBridgeConnected(ClientState.getInstance().isConnected());
    }, 1_000);

    useEffect(() => {
        setSimBridgeConnected(ClientState.getInstance().isConnected());

        const interval = setInterval(() => {
            setShowSchedTimes((old) => !old);

            setTimeout(() => {
                setShowSchedTimes((old) => !old);
            }, 5_000);
        }, 30_000);

        return () => {
            clearInterval(interval);
            if (shutoffTimerRef.current) {
                clearInterval(shutoffTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex fixed z-30 justify-between items-center px-6 w-full h-10 text-lg font-medium leading-none text-theme-text bg-theme-statusbar">
            <p>{`${dayName} ${monthName} ${dayOfMonth}`}</p>

            {outdatedVersionFlag ? (
                <div className="flex overflow-hidden absolute left-48 justify-center items-center w-96 h-10 ">
                    <TooltipWrapper text={t('VersionCheck.TT.StatusBarWarning')}>
                        <span className="text-utility-red">{t('VersionCheck.StatusBarWarning').toUpperCase()}</span>
                    </TooltipWrapper>
                </div>
            ) : ''}

            <div className="flex absolute inset-x-0 flex-row justify-center items-center mx-auto space-x-4 w-min">
                {(timeDisplayed === 'utc' || timeDisplayed === 'both') && (
                    <p>{getZuluFormattedTime(currentUTC)}</p>
                )}
                {timeDisplayed === 'both' && (
                    <p>/</p>
                )}
                {(timeDisplayed === 'local' || timeDisplayed === 'both') && (
                    <p>{getLocalFormattedTime(currentLocalTime)}</p>
                )}
            </div>

            <div className="flex items-center space-x-4">
                {(!!showStatusBarFlightProgress && (data !== initialState.data)) && (
                    <div
                        className="flex overflow-hidden flex-row items-center pr-10 space-x-4 h-10"
                        onClick={() => setShowSchedTimes((old) => !old)}
                    >
                        <div className={`${showSchedTimes ? '-translate-y-1/4' : 'translate-y-1/4'} transform transition text-right duration-100 flex flex-col space-y-1`}>
                            <p>{departingAirport}</p>
                            <p>{schedOutParsed}</p>
                        </div>
                        <div className="flex flex-row w-32">
                            <div className="h-1 bg-theme-highlight" style={{ width: `${flightPlanProgress}%` }} />
                            <div className="h-1 bg-theme-text" style={{ width: `${100 - flightPlanProgress}%` }} />
                        </div>
                        <div className={`${showSchedTimes ? '-translate-y-1/4' : 'translate-y-1/4'} transform transition duration-100 flex flex-col space-y-1`}>
                            <p>{arrivingAirport}</p>
                            <p>{schedInParsed}</p>
                        </div>
                    </div>
                )}

                <QuickControls />

                <TooltipWrapper text={simBridgeConnected ? t('StatusBar.TT.ConnectedToLocalApi') : t('StatusBar.TT.DisconnectedFromLocalApi')}>
                    {simBridgeConnected ? (
                        <Wifi size={26} />
                    ) : (
                        <WifiOff size={26} />
                    )}
                </TooltipWrapper>

                <BatteryStatus batteryLevel={batteryLevel} isCharging={isCharging} />
            </div>
        </div>
    );
};
