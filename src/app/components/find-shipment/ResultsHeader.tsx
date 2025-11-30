import { Paper, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ResultsHeaderProps {
  count: number;
}

export default function ResultsHeader({ count }: ResultsHeaderProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 1.5,
        mb: 1,
        borderRadius: 2,
        bgcolor: 'primary.main',
        color: 'white',
        maxWidth: { sm: '700px' },
        mx: 'auto',
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.95rem' }}>
        <CheckCircleIcon sx={{ fontSize: 20 }} />
        نتایج جستجو ({count})
      </Typography>
    </Paper>
  );
}

