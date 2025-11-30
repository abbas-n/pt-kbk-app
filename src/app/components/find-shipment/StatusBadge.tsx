import { Chip } from '@mui/material';

interface StatusBadgeProps {
  statusTitle?: string;
  status?: number | string;
}

export default function StatusBadge({ statusTitle, status }: StatusBadgeProps) {
  if (statusTitle) {
    return (
      <Chip
        label={statusTitle}
        color={status === 25 ? 'warning' : status === 21 ? 'info' : 'default'}
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    );
  }
  
  const statusNum = typeof status === 'string' ? parseInt(status) : status;
  if (statusNum === 25) {
    return <Chip label="وضعیت: 25" color="warning" size="small" sx={{ fontWeight: 600 }} />;
  } else if (statusNum === 21) {
    return <Chip label="وضعیت: 21" color="info" size="small" sx={{ fontWeight: 600 }} />;
  }
  
  return status ? <Chip label={`وضعیت: ${statusNum || status}`} size="small" /> : null;
}

