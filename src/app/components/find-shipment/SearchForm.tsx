'use client';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Collapse,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface SearchFormData {
  kargoId: string;
  shipmentCode: string;
  shipmentEnteredCode: string;
  receiverName: string;
  receiverPhone: string;
}

interface SearchFormProps {
  formData: SearchFormData;
  loading: boolean;
  error: string | null;
  expanded: boolean;
  onFormDataChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => void;
  onSearch: () => void;
  onToggleExpanded: () => void;
}

export default function SearchForm({
  formData,
  loading,
  error,
  expanded,
  onFormDataChange,
  onSearch,
  onToggleExpanded,
}: SearchFormProps) {
  const handleNumericChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    if (digitsOnly !== event.target.value) {
      event.target.value = digitsOnly;
    }
    onFormDataChange(event);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        mb: 1,
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          bgcolor: 'primary.main',
          color: 'white',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
        onClick={onToggleExpanded}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SearchIcon sx={{ fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            جستجوی بارنامه
          </Typography>
        </Box>
        <IconButton
          sx={{ color: 'white' }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpanded();
          }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Divider sx={{ mb: 4 }} />

          {/* فیلد پورت مخفی - فقط برای ارسال به API */}
          <Box sx={{ display: 'none' }}>
            <FormControl fullWidth required>
              <InputLabel>پورت</InputLabel>
              <Select
                name="kargoId"
                value={formData.kargoId}
                onChange={onFormDataChange}
                label="پورت"
              >
                <MenuItem value="1">بیهقی</MenuItem>
                <MenuItem value="7">غریب</MenuItem>
                <MenuItem value="281">جنوب</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              maxWidth: 500,
              mx: 'auto',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <Grid container spacing={4} sx={{ width: '100%' }}>
              <Grid xs={12} sx={{ mt: 1.5, mb: 1.5 }}>
                <TextField
                  fullWidth
                  label="کد بارنامه"
                  name="shipmentCode"
                  value={formData.shipmentCode}
                  onChange={handleNumericChange}
                  dir="ltr"
                  variant="outlined"
                  placeholder="کد بارنامه را وارد کنید"
                  inputProps={{
                    style: { textAlign: 'left' },
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderWidth: '2px',
                        borderColor: '#e0e0e0',
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        '& fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>

              <Grid xs={12} sx={{ mb: 1.5 }}>
                <TextField
                  fullWidth
                  label="کد ورودی بارنامه"
                  name="shipmentEnteredCode"
                  value={formData.shipmentEnteredCode}
                  onChange={handleNumericChange}
                  dir="ltr"
                  variant="outlined"
                  placeholder="کد ورودی بارنامه را وارد کنید"
                  inputProps={{
                    style: { textAlign: 'left' },
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderWidth: '2px',
                        borderColor: '#e0e0e0',
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        '& fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>

              <Grid xs={12} sx={{ mb: 1.5 }}>
                <TextField
                  fullWidth
                  label="نام گیرنده"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={onFormDataChange}
                  variant="outlined"
                  placeholder="نام گیرنده را وارد کنید"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderWidth: '2px',
                        borderColor: '#e0e0e0',
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        '& fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>

              <Grid xs={12} sx={{ mb: 1.5 }}>
                <TextField
                  fullWidth
                  label="شماره تماس گیرنده"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleNumericChange}
                  dir="ltr"
                  variant="outlined"
                  placeholder="شماره تماس گیرنده را وارد کنید"
                  inputProps={{
                    style: { textAlign: 'left' },
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                      transition: 'all 0.3s ease',
                      '& fieldset': {
                        borderWidth: '2px',
                        borderColor: '#e0e0e0',
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        '& fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '2px',
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 500,
                    },
                  }}
                />
              </Grid>

              <Grid xs={12} sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
                  onClick={onSearch}
                  disabled={loading}
                  size="medium"
                  sx={{
                    py: 1.25,
                    px: 2.5,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    '& .MuiButton-startIcon': {
                      marginLeft: '8px',
                      marginRight: 0,
                      '& > *:nth-of-type(1)': {
                        fontSize: '1.2rem',
                      },
                    },
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {loading ? 'در حال جستجو...' : 'جستجو'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: 24,
                },
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

