import { useEffect, useState } from "react";
import { toast } from "sonner";
import useAppSettings from "src/features/app-settings/hooks/useAppSettings";
import { Session } from "src/features/session/types/Session";
import sessionStorageService from "src/shared/services/sessionStorageService";
import sessionHistoryService from "../services/sessionHistoryService";
import { getLastBackup, getLastBackupReminder, isCurrentMonth, recordBackupReminder } from "../services/historyBackupStorage";

export default function MonthlyHistoryBackup() {
    const { appSettings } = useAppSettings();
    const [automaticBackupOnStartup] = useState(appSettings.automaticMonthlyBackup);

    useEffect(() => {
        let cancelled = false;
        const download = async () => {
            const sessions = await sessionStorageService.getItems<Session>("History");
            sessionHistoryService.exportHistoryWithFileDownload(sessions);
        };
        const check = async () => {
            if (isCurrentMonth(getLastBackup())) return;
            if (!automaticBackupOnStartup && isCurrentMonth(getLastBackupReminder())) return;
            const sessions = await sessionStorageService.getItems<Session>("History");
            if (cancelled || isCurrentMonth(getLastBackup())) return;
            if (automaticBackupOnStartup) {
                sessionHistoryService.exportHistoryWithFileDownload(sessions);
                toast.success("Backup del mes realizado");
            } else if (!isCurrentMonth(getLastBackupReminder())) {
                toast.info("Guardá un backup del mes", {
                    id: "monthly-history-backup",
                    duration: 15000,
                    action: {
                        label: "Descargar",
                        onClick: () => { download().catch(() => toast.error("No se pudo realizar el backup")); },
                    },
                });
                recordBackupReminder();
            }
        };
        check().catch(() => {
            if (!cancelled) toast.error("No se pudo realizar el backup");
        });
        return () => { cancelled = true; };
    }, [automaticBackupOnStartup]);

    return null;
}
