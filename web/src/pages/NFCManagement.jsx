import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Nfc as NfcIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  QrCode as QrCodeIcon,
  History as HistoryIcon,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import QRCode from 'qrcode.react'
import { useAuth } from '../contexts/AuthContext'
import { nfcAPI } from '../services/api'

function NFCManagement() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  // NFC Tags
  const [tags, setTags] = useState([])
  const [createDialog, setCreateDialog] = useState(false)
  const [qrDialog, setQrDialog] = useState(false)
  const [selectedTag, setSelectedTag] = useState(null)
  const [newTagName, setNewTagName] = useState('')

  // Access Logs
  const [accessLogs, setAccessLogs] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [tagsRes, logsRes] = await Promise.all([nfcAPI.getTags(), nfcAPI.getAccessLogs()])
      setTags(tagsRes.data)
      setAccessLogs(logsRes.data)
    } catch (error) {
      toast.error('Ошибка загрузки данных')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Введите название метки')
      return
    }

    try {
      const response = await nfcAPI.createTag({ name: newTagName })
      setTags([...tags, response.data])
      setCreateDialog(false)
      setNewTagName('')
      toast.success('NFC метка создана')
    } catch (error) {
      toast.error('Ошибка создания метки')
      console.error(error)
    }
  }

  const handleToggleActive = async (tag) => {
    try {
      const newStatus = !tag.is_active
      await nfcAPI.updateTag(tag.id, { is_active: newStatus })
      setTags(tags.map((t) => (t.id === tag.id ? { ...t, is_active: newStatus } : t)))
      toast.success(newStatus ? 'Метка активирована' : 'Метка деактивирована')
    } catch (error) {
      toast.error('Ошибка изменения статуса метки')
      console.error(error)
    }
  }

  const handleShowQR = (tag) => {
    setSelectedTag(tag)
    setQrDialog(true)
  }

  const getAccessUrl = (tagId) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    return `${baseUrl}/nfc/access/${tagId}/`
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Управление NFC
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {user?.first_name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label="Мои метки" icon={<NfcIcon />} iconPosition="start" />
            <Tab label="История доступа" icon={<HistoryIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab 1: NFC Tags */}
        {activeTab === 0 && (
          <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5">Мои NFC метки</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateDialog(true)}
              >
                Создать метку
              </Button>
            </Box>

            {tags.length === 0 ? (
              <Alert severity="info">
                У вас пока нет NFC меток. Создайте первую метку, чтобы начать использовать систему.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {tags.map((tag) => (
                  <Grid item xs={12} md={6} key={tag.id}>
                    <Card elevation={3}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NfcIcon color="primary" />
                            <Typography variant="h6">{tag.name}</Typography>
                          </Box>
                          <Chip
                            label={tag.is_active ? 'Активна' : 'Неактивна'}
                            color={tag.is_active ? 'success' : 'default'}
                            icon={tag.is_active ? <CheckCircleIcon /> : <CancelIcon />}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ID: {tag.uid}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Создана:{' '}
                          {new Date(tag.created_at).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                        {tag.last_accessed && (
                          <Typography variant="body2" color="text.secondary">
                            Последний доступ:{' '}
                            {new Date(tag.last_accessed).toLocaleString('ru-RU')}
                          </Typography>
                        )}

                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" fontWeight="bold" gutterBottom>
                            Статистика:
                          </Typography>
                          <Typography variant="body2">
                            Всего обращений: {tag.access_count || 0}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            Активна:
                          </Typography>
                          <Switch
                            checked={tag.is_active}
                            onChange={() => handleToggleActive(tag)}
                            color="success"
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          startIcon={<QrCodeIcon />}
                          onClick={() => handleShowQR(tag)}
                        >
                          QR-код
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Tab 2: Access Logs */}
        {activeTab === 1 && (
          <>
            <Typography variant="h5" gutterBottom>
              История доступа
            </Typography>

            {accessLogs.length === 0 ? (
              <Alert severity="info">История доступа пуста</Alert>
            ) : (
              <TableContainer component={Paper} elevation={3}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Дата и время</TableCell>
                      <TableCell>NFC метка</TableCell>
                      <TableCell>Тип доступа</TableCell>
                      <TableCell>IP адрес</TableCell>
                      <TableCell>Статус</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accessLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.accessed_at).toLocaleString('ru-RU', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>{log.nfc_tag_name || log.nfc_tag}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.access_type === 'NFC' ? 'NFC' : 'QR-код'}
                            size="small"
                            color={log.access_type === 'NFC' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>{log.ip_address || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.access_granted ? 'Успешно' : 'Отказано'}
                            size="small"
                            color={log.access_granted ? 'success' : 'error'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Container>

      {/* Create Tag Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создать NFC метку</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
            После создания метки вам будет предоставлен уникальный QR-код и ID для программирования
            NFC метки.
          </Alert>
          <TextField
            autoFocus
            fullWidth
            label="Название метки"
            placeholder="Например: Основная метка, Запасная метка"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            helperText="Дайте метке понятное название для удобства"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Отмена</Button>
          <Button onClick={handleCreateTag} variant="contained">
            Создать
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialog} onClose={() => setQrDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>QR-код для доступа</DialogTitle>
        <DialogContent>
          {selectedTag && (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedTag.name}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    border: '1px solid #ddd',
                    mb: 2,
                  }}
                >
                  <QRCode value={getAccessUrl(selectedTag.uid)} size={256} level="H" />
                </Box>
                <Alert severity="info" sx={{ width: '100%' }}>
                  Отсканируйте этот QR-код для доступа к медицинским данным без физической NFC
                  метки.
                </Alert>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 2, wordBreak: 'break-all', textAlign: 'center' }}
                >
                  {getAccessUrl(selectedTag.uid)}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialog(false)}>Закрыть</Button>
          <Button
            variant="contained"
            onClick={() => {
              const canvas = document.querySelector('canvas')
              const url = canvas.toDataURL('image/png')
              const link = document.createElement('a')
              link.download = `nfc-qr-${selectedTag.name}.png`
              link.href = url
              link.click()
              toast.success('QR-код сохранен')
            }}
          >
            Скачать QR-код
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NFCManagement
