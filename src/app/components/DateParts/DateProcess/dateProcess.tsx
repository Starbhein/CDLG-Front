"use client";

import { useState, useEffect } from "react";
import Speciality from "../Speciality/speciality";
import Doctors from "../Doctors/doctors";
import Day from "../Day/day";
import Hour from "../Hour/hour";
import Payment from "../Payment/payment";

// 1. Definimos qué tipos de datos puede recibir este componente
interface DateProcessProps {
  onStepChange?: (step: number) => void;
}

interface SelectedSpeciality {
  id: number;
  name: string;
  cost: number;
}

interface SelectedDoctor {
  id_contrato: string;
  nombre: string;
  id_consultorio: number;
  no_consultorio: number;
}

// 2. Agregamos las props a la función (destructuring)
const DateProcess = ({ onStepChange }: DateProcessProps) => {
  const [step, setStep] = useState(0);

  const [speciality, setSpeciality] = useState<SelectedSpeciality | null>(null);
  const [doctor, setDoctor] = useState<SelectedDoctor | null>(null);
  const [day, setDay] = useState<{ fecha: string; total_horas: number } | null>(null);
  const [hour, setHour] = useState<string | null>(null);

  // 3. Sincronizamos el paso local con el padre cada vez que cambie 'step'
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  const nextStep = () => setStep((prev) => prev + 1);

  return (
    <div>
      {/* ===== PASO 0: ESPECIALIDAD ===== */}
      {step === 0 && (
        <Speciality
          onNext={(value) => {
            setSpeciality(value);
            nextStep();
          }}
        />
      )}

      {/* ===== PASO 1: DOCTOR ===== */}
      {step === 1 && speciality && (
        <Doctors
          specialityId={speciality.id}
          onNext={(value) => {
            setDoctor(value);
            nextStep();
          }}
        />
      )}

      {/* ===== PASO 2: DÍA ===== */}
      {step === 2 && doctor && speciality && (
        <Day
          idContrato={doctor.id_contrato}
          idEspecialidad={speciality.id}
          no_consultorio={doctor.no_consultorio}
          onNext={(value) => {
            setDay(value);
            nextStep();
          }}
        />
      )}

      {/* ===== PASO 3: HORA ===== */}
      {step === 3 && doctor && day && (
        <Hour
          doctorId={doctor.id_contrato}
          fecha={day.fecha}
          no_consultorio={doctor.no_consultorio}
          onNext={(value) => {
            setHour(value);
            nextStep();
          }}
        />
      )}

      {/* ===== PASO 4: PAGO ===== */}
      {step === 4 && speciality && doctor && day && hour && (
        <Payment
          speciality={speciality.name}
          cost={speciality.cost}
          doctor={doctor.nombre}
          doctorId={doctor.id_contrato}
          no_consultorio={doctor.no_consultorio}
          day={day.fecha}
          hour={hour}
          /* --- AGREGA ESTO --- */
          onNext={(resultado: any) => {
            console.log("Proceso finalizado", resultado);
            // Aquí podrías agregar un router.push('/gracias') si tuvieras el router
          }}
        />
      )}
    </div>
  );
};

// 4. CORRECCIÓN IMPORTANTE: Quitamos los paréntesis aquí
export default DateProcess;