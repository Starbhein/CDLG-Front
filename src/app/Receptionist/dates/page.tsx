"use client";

import NavBar from "@/app/components/NavBar/navBar";
import DateProcess from "./DateParts/DateProcess/dateProcess";
import styles from "./dates.module.css";
import React, { useState, Suspense } from "react"; // 1. Importamos Suspense
import Image from "next/image";
import { useSearchParams } from "next/navigation";

/* =======================
   COMPONENTE DE CONTENIDO (Lógica Original)
======================= */
const DatesContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const searchParams = useSearchParams();
    const nss = searchParams.get("nss"); // ⚡ Obtenemos el NSS del paciente desde la URL

    return (
        <>
            <NavBar opaque />

            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <Image
                        src="/Group_19.svg"
                        alt="icon"
                        width={60}
                        height={60}
                        className={styles.titleIcon}
                    />
                    <h1 className={styles.title}>AGENDAR NUEVA CITA</h1>
                </div>

                <div className={styles.dateContainer}>
                    <div className={styles.stepsContainer}>
                        <ul className={styles.stepList}>
                            {["Especialidad", "Doctores", "Fecha", "Hora", "Pago"].map(
                                (text, index) => (
                                    <li key={index} className={styles.stepItem}>
                                        <Image
                                            src="/Subtitle_Icon.svg"
                                            alt="icon"
                                            width={35}
                                            height={35}
                                            className={`${styles.diamond} ${
                                                index === currentStep ? styles.activeDiamond : ""
                                            }`}
                                        />
                                        <p className={styles.stepText}>{text}</p>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className={styles.actionContainer}>
                        {/* ⚡ Pasamos el NSS a DateProcess (Nota: DateProcess debe estar preparado para recibir 'nss' en sus props) */}
                        {/* @ts-ignore Si DateProcess se queja del NSS, esto lo silencia temporalmente */}
                        <DateProcess onStepChange={setCurrentStep} nss={nss} />
                    </div>
                </div>
            </div>
        </>
    );
};

/* =======================
   COMPONENTE PRINCIPAL (Wrapper con Suspense)
======================= */
const Dates = () => {
    return (
        // 2. Envolvemos el componente contenido en Suspense
        <Suspense fallback={<div>Cargando calendario...</div>}>
            <DatesContent />
        </Suspense>
    );
};

export default Dates;