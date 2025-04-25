import { useRef } from "react";
import useAppSettings from "src/features/app-settings/hooks/useAppSettings";

let globalAudioPlayer: HTMLAudioElement | undefined;
interface Props {
    globalChannel?: boolean;
    volume?: number;
}

export function useAudioPlayer({ globalChannel = false, volume = 1 }: Props) {
    const audioRef = useRef<HTMLAudioElement>();
    const audioVolume = useRef(volume);

    // Check if sounds are enabled
    const { appSettings } = useAppSettings();

    const getAudioPlayer = (createNew: boolean = true) => {
        if (globalChannel) {
            if (!globalAudioPlayer && createNew)
                globalAudioPlayer = new Audio();
            return globalAudioPlayer;
        }
        else {
            if (!audioRef.current && createNew)
                audioRef.current = new Audio();
            return audioRef.current;
        }
    }

    const playAudio = (url: string, vol?: number) => {
        if (!appSettings.soundsEnabled) return;
        const audio = getAudioPlayer(true);
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
        audio.src = url;
        setVolume(vol ?? volume);
        audio.play().catch((error) => {
            console.error("Error al reproducir:", error);
        });
    };

    const stopAudio = () => {
        const audio = getAudioPlayer(false);
        if (!audio) return;

        audio.pause();
        audio.src = "";
    };

    const setVolume = (volume: number) => {
        audioVolume.current = volume;

        const audio = getAudioPlayer(false);
        if (audio) audio.volume = volume;
    };

    return { playAudio, stopAudio, setVolume };
}