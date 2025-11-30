import { Paper, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface EmptyStateProps {
  onOpenSearch: () => void;
}

export default function EmptyState({ onOpenSearch }: EmptyStateProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 5,
        textAlign: 'center',
        borderRadius: 3,
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
      <Typography variant="h6" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
        نتیجه‌ای یافت نشد
      </Typography>
      <Typography variant="body2" color="text.secondary">
        لطفاً برای جستجو فرم را پر کنید
      </Typography>
      <Button
        variant="outlined"
        onClick={onOpenSearch}
        sx={{ mt: 3 }}
      >
        باز کردن فرم جستجو
      </Button>
    </Paper>
  );
}

