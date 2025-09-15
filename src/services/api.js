import { requestService } from '../utils/request.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !requestService.baseURL;

export const apiService = {
  getData: async () => {
    // Mock API call
    return { data: 'Hello from API' }
  },
  login: async (email, password) => {
    try {
      return await requestService.post('/api/auth/login', { email, password });
    } catch (error) {
      throw error;
    }
  },
  registerMedico: async (medicoData) => {
    // Mock response for development
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            mensaje: "Médico registrado exitosamente",
            usuario: {
              id: Date.now(),
              ...medicoData,
              rol: "MEDICO"
            }
          })
        }, 1000)
      })
    }

    try {
      return await requestService.post('/api/usuarios/medico', medicoData);
    } catch (error) {
      throw error;
    }
  },
  registerPaciente: async (pacienteData) => {
    // Mock response for development
    if (USE_MOCK) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            mensaje: "Paciente registrado exitosamente",
            usuario: {
              id: Date.now(),
              ...pacienteData,
              rol: "PACIENTE"
            }
          })
        }, 1000)
      })
    }

    try {
      return await requestService.post('/api/usuarios/paciente', pacienteData);
    } catch (error) {
      throw error;
    }
  },
  getDoctors: async (filters = {}) => {
    try {
      return await requestService.get('/api/listarMedicos/medicos', filters);
    } catch (error) {
      throw error;
    }
  },
  getSpecialties: async () => {
    try {
      const response = await requestService.get('/api/especialidades');
      return response;
    } catch (error) {
      throw error;
    }
  },
  getDoctorAvailableSlots: async (doctorId, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('idMedico', doctorId);

      if (filters.estado && filters.estado !== '') {
        params.append('estado', filters.estado);
      }

      if (filters.modalidad && filters.modalidad !== '') {
        params.append('modalidad', filters.modalidad);
      }

      const response = await requestService.get(`/api/horarios/disponibles/semana?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getDoctorSlotsByDateRange: async (doctorId, fechaInicio, fechaFin, filters = {}) => {
    try {
      const params = new URLSearchParams();
      params.append('fechaInicio', fechaInicio);
      params.append('fechaFin', fechaFin);
      params.append('idMedico', doctorId);

      if (filters.estado && filters.estado !== '') {
        params.append('estado', filters.estado);
      }

      if (filters.modalidad && filters.modalidad !== '') {
        params.append('modalidad', filters.modalidad);
      }

      const response = await requestService.get(`/api/horarios/disponibles/rango?${params.toString()}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  saveCita: async (citaData) => {
    try {
      return await requestService.post('/api/citas/save', citaData);
    } catch (error) {
      throw error;
    }
  },
  getPatientAppointments: async (patientId) => {
    try {
      return await requestService.get(`/api/citas/paciente/${patientId}`);
    } catch (error) {
      throw error;
    }
  }
}
