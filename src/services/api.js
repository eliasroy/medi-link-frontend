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

    try {
      const uri = import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000';
      const response = await fetch(`${uri}/api/usuarios/medico`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(medicoData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  registerPaciente: async (pacienteData) => {


    try {
      const uri = import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000';
      const response = await fetch(`${uri}/api/usuarios/paciente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pacienteData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
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
      const uri = import.meta.env.VITE_URL_BACKEND || 'http://localhost:3000';
      const response = await fetch(`${uri}/api/especialidades`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data; // Return the data array
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
  },
  getDoctorAppointments: async () => {
    try {
      return await requestService.get('/api/citas/medico');
    } catch (error) {
      throw error;
    }
  },
  deleteCita: async (citaId) => {
    try {
      return await requestService.delete(`/api/citas/${citaId}`);
    } catch (error) {
      throw error;
    }
  },
  iniciarConsulta: async (consultaData) => {
    try {
      return await requestService.post('/api/consultas/iniciar', consultaData);
    } catch (error) {
      throw error;
    }
  },
  getConsultaByCita: async (citaId) => {
    try {
      return await requestService.get(`/api/consultas/cita/${citaId}`);
    } catch (error) {
      throw error;
    }
  },
  updateConsulta: async (consultaId, consultaData) => {
    try {
      return await requestService.put(`/api/consultas/actualizar/${consultaId}`, consultaData);
    } catch (error) {
      throw error;
    }
  },
  calificarConsulta: async (calificacionData) => {
    try {
      return await requestService.post('/api/consultas/calificar', calificacionData);
    } catch (error) {
      throw error;
    }
  },
  saveHorario: async (horarioData) => {
    try {
      return await requestService.post('/api/horarios/save', horarioData);
    } catch (error) {
      throw error;
    }
  }
}
