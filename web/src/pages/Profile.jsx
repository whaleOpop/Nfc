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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import { profileAPI } from '../services/api'

function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Profile data
  const [profile, setProfile] = useState({
    blood_type: '',
    height: '',
    weight: '',
    emergency_notes: '',
  })

  // Lists
  const [allergies, setAllergies] = useState([])
  const [diseases, setDiseases] = useState([])
  const [medications, setMedications] = useState([])
  const [emergencyContacts, setEmergencyContacts] = useState([])

  // Dialog states
  const [allergyDialog, setAllergyDialog] = useState(false)
  const [diseaseDialog, setDiseaseDialog] = useState(false)
  const [medicationDialog, setMedicationDialog] = useState(false)
  const [contactDialog, setContactDialog] = useState(false)

  // Form data for dialogs
  const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'MEDIUM' })
  const [newDisease, setNewDisease] = useState({ name: '', diagnosed_date: '', notes: '' })
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    start_date: '',
  })
  const [newContact, setNewContact] = useState({
    full_name: '',
    relationship: '',
    phone: '',
  })

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const [profileRes, allergiesRes, diseasesRes, medicationsRes, contactsRes] =
        await Promise.all([
          profileAPI.getProfile(),
          profileAPI.getAllergies(),
          profileAPI.getChronicDiseases(),
          profileAPI.getMedications(),
          profileAPI.getEmergencyContacts(),
        ])

      setProfile(profileRes.data)
      setAllergies(allergiesRes.data)
      setDiseases(diseasesRes.data)
      setMedications(medicationsRes.data)
      setEmergencyContacts(contactsRes.data)
    } catch (error) {
      toast.error('Ошибка загрузки данных профиля')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await profileAPI.updateProfile(profile)
      toast.success('Профиль обновлен')
    } catch (error) {
      toast.error('Ошибка сохранения профиля')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddAllergy = async () => {
    try {
      const response = await profileAPI.addAllergy(newAllergy)
      setAllergies([...allergies, response.data])
      setAllergyDialog(false)
      setNewAllergy({ name: '', severity: 'MEDIUM' })
      toast.success('Аллергия добавлена')
    } catch (error) {
      toast.error('Ошибка добавления аллергии')
      console.error(error)
    }
  }

  const handleDeleteAllergy = async (id) => {
    try {
      await profileAPI.deleteAllergy(id)
      setAllergies(allergies.filter((a) => a.id !== id))
      toast.success('Аллергия удалена')
    } catch (error) {
      toast.error('Ошибка удаления аллергии')
      console.error(error)
    }
  }

  const handleAddDisease = async () => {
    try {
      const response = await profileAPI.addChronicDisease(newDisease)
      setDiseases([...diseases, response.data])
      setDiseaseDialog(false)
      setNewDisease({ name: '', diagnosed_date: '', notes: '' })
      toast.success('Заболевание добавлено')
    } catch (error) {
      toast.error('Ошибка добавления заболевания')
      console.error(error)
    }
  }

  const handleDeleteDisease = async (id) => {
    try {
      await profileAPI.deleteChronicDisease(id)
      setDiseases(diseases.filter((d) => d.id !== id))
      toast.success('Заболевание удалено')
    } catch (error) {
      toast.error('Ошибка удаления заболевания')
      console.error(error)
    }
  }

  const handleAddMedication = async () => {
    try {
      const response = await profileAPI.addMedication(newMedication)
      setMedications([...medications, response.data])
      setMedicationDialog(false)
      setNewMedication({ name: '', dosage: '', frequency: '', start_date: '' })
      toast.success('Препарат добавлен')
    } catch (error) {
      toast.error('Ошибка добавления препарата')
      console.error(error)
    }
  }

  const handleDeleteMedication = async (id) => {
    try {
      await profileAPI.deleteMedication(id)
      setMedications(medications.filter((m) => m.id !== id))
      toast.success('Препарат удален')
    } catch (error) {
      toast.error('Ошибка удаления препарата')
      console.error(error)
    }
  }

  const handleAddContact = async () => {
    try {
      const response = await profileAPI.addEmergencyContact(newContact)
      setEmergencyContacts([...emergencyContacts, response.data])
      setContactDialog(false)
      setNewContact({ full_name: '', relationship: '', phone: '' })
      toast.success('Контакт добавлен')
    } catch (error) {
      toast.error('Ошибка добавления контакта')
      console.error(error)
    }
  }

  const handleDeleteContact = async (id) => {
    try {
      await profileAPI.deleteEmergencyContact(id)
      setEmergencyContacts(emergencyContacts.filter((c) => c.id !== id))
      toast.success('Контакт удален')
    } catch (error) {
      toast.error('Ошибка удаления контакта')
      console.error(error)
    }
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
            Медицинский профиль
          </Typography>
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {user?.first_name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Basic Medical Info */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Основная информация
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Группа крови</InputLabel>
                    <Select
                      value={profile.blood_type}
                      label="Группа крови"
                      onChange={(e) => setProfile({ ...profile, blood_type: e.target.value })}
                    >
                      <MenuItem value="O+">O (I) Rh+</MenuItem>
                      <MenuItem value="O-">O (I) Rh-</MenuItem>
                      <MenuItem value="A+">A (II) Rh+</MenuItem>
                      <MenuItem value="A-">A (II) Rh-</MenuItem>
                      <MenuItem value="B+">B (III) Rh+</MenuItem>
                      <MenuItem value="B-">B (III) Rh-</MenuItem>
                      <MenuItem value="AB+">AB (IV) Rh+</MenuItem>
                      <MenuItem value="AB-">AB (IV) Rh-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Рост (см)"
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Вес (кг)"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Экстренные заметки"
                    placeholder="Важная информация для медиков в экстренной ситуации..."
                    value={profile.emergency_notes}
                    onChange={(e) => setProfile({ ...profile, emergency_notes: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Allergies */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Аллергии</Typography>
                  <IconButton color="primary" onClick={() => setAllergyDialog(true)}>
                    <AddIcon />
                  </IconButton>
                </Box>
                {allergies.length === 0 ? (
                  <Alert severity="info">Нет данных об аллергиях</Alert>
                ) : (
                  <List>
                    {allergies.map((allergy, index) => (
                      <Box key={allergy.id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemText
                            primary={allergy.name}
                            secondary={
                              <Chip
                                label={
                                  allergy.severity === 'LOW'
                                    ? 'Низкая'
                                    : allergy.severity === 'MEDIUM'
                                    ? 'Средняя'
                                    : 'Высокая'
                                }
                                size="small"
                                color={
                                  allergy.severity === 'HIGH'
                                    ? 'error'
                                    : allergy.severity === 'MEDIUM'
                                    ? 'warning'
                                    : 'default'
                                }
                              />
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleDeleteAllergy(allergy.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Chronic Diseases */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Хронические заболевания</Typography>
                  <IconButton color="primary" onClick={() => setDiseaseDialog(true)}>
                    <AddIcon />
                  </IconButton>
                </Box>
                {diseases.length === 0 ? (
                  <Alert severity="info">Нет данных о заболеваниях</Alert>
                ) : (
                  <List>
                    {diseases.map((disease, index) => (
                      <Box key={disease.id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemText
                            primary={disease.name}
                            secondary={
                              disease.diagnosed_date
                                ? `Диагностировано: ${new Date(
                                    disease.diagnosed_date
                                  ).toLocaleDateString('ru-RU')}`
                                : null
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDeleteDisease(disease.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Medications */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Принимаемые препараты</Typography>
                  <IconButton color="primary" onClick={() => setMedicationDialog(true)}>
                    <AddIcon />
                  </IconButton>
                </Box>
                {medications.length === 0 ? (
                  <Alert severity="info">Нет данных о препаратах</Alert>
                ) : (
                  <List>
                    {medications.map((med, index) => (
                      <Box key={med.id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemText
                            primary={med.name}
                            secondary={`${med.dosage} - ${med.frequency}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDeleteMedication(med.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Emergency Contacts */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Экстренные контакты</Typography>
                  <IconButton color="primary" onClick={() => setContactDialog(true)}>
                    <AddIcon />
                  </IconButton>
                </Box>
                {emergencyContacts.length === 0 ? (
                  <Alert severity="warning">Добавьте хотя бы один контакт</Alert>
                ) : (
                  <List>
                    {emergencyContacts.map((contact, index) => (
                      <Box key={contact.id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemText
                            primary={contact.full_name}
                            secondary={`${contact.relationship} - ${contact.phone}`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDeleteContact(contact.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Add Allergy Dialog */}
      <Dialog open={allergyDialog} onClose={() => setAllergyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить аллергию</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Название"
            value={newAllergy.name}
            onChange={(e) => setNewAllergy({ ...newAllergy, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Степень тяжести</InputLabel>
            <Select
              value={newAllergy.severity}
              label="Степень тяжести"
              onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value })}
            >
              <MenuItem value="LOW">Низкая</MenuItem>
              <MenuItem value="MEDIUM">Средняя</MenuItem>
              <MenuItem value="HIGH">Высокая</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAllergyDialog(false)}>Отмена</Button>
          <Button onClick={handleAddAllergy} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Disease Dialog */}
      <Dialog open={diseaseDialog} onClose={() => setDiseaseDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить заболевание</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Название"
            value={newDisease.name}
            onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Дата диагностирования"
            type="date"
            value={newDisease.diagnosed_date}
            onChange={(e) => setNewDisease({ ...newDisease, diagnosed_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Заметки"
            value={newDisease.notes}
            onChange={(e) => setNewDisease({ ...newDisease, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiseaseDialog(false)}>Отмена</Button>
          <Button onClick={handleAddDisease} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Medication Dialog */}
      <Dialog
        open={medicationDialog}
        onClose={() => setMedicationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить препарат</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Название"
            value={newMedication.name}
            onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Дозировка"
            value={newMedication.dosage}
            onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Частота приема"
            placeholder="Например: 2 раза в день"
            value={newMedication.frequency}
            onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Дата начала приема"
            type="date"
            value={newMedication.start_date}
            onChange={(e) => setNewMedication({ ...newMedication, start_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMedicationDialog(false)}>Отмена</Button>
          <Button onClick={handleAddMedication} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Contact Dialog */}
      <Dialog open={contactDialog} onClose={() => setContactDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить контакт</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="ФИО"
            value={newContact.full_name}
            onChange={(e) => setNewContact({ ...newContact, full_name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Отношение"
            placeholder="Например: Супруг/Супруга, Родитель"
            value={newContact.relationship}
            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Телефон"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialog(false)}>Отмена</Button>
          <Button onClick={handleAddContact} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Profile
