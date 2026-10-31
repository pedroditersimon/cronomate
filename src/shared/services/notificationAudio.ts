export function playNotificationAudio(url: string, enabled: boolean) {
    if (!enabled) return;
    const audio = new Audio(url);
    audio.volume = 0.5;
    void audio.play().catch(() => { /* Browser autoplay permissions may block audio. */ });
}
