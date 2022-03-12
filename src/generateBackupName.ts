function getDateString(date: Date) {
    return date.toLocaleString().replaceAll(/[^\d]/g, "-");
  }
  
  export default function generateBackupName() {
    return "coggle_backup_" + getDateString(new Date());
  }
  