"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "../../components/Form/form";
import IconButton from "../../components/IconButton/iconButton";
import TextInput from "../../components/TextInput/textInput";
import styles from "./login.module.css";
import Image from "next/image";
import { CardiologyIcon } from "@/app/components/Icons/Icons";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";  // 🔹 Asegúrate de importar así

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo: email,
          pass: password
        })
      });

      console.log("STATUS:", response.status);
      console.log("RESPONSE OBJ:", response);

      const data = await response.json();
      console.log("RESPUESTA DEL BACKEND:", data);

      if (!response.ok) {
        setErrorMessage(data.message || "Credenciales incorrectas");
        return;
      }

      // Guardar token en cookies
      Cookies.set("token", data.token, { expires: 1 });  // expira en 1 día
      console.log("TOKEN GUARDADO EN COOKIE:", Cookies.get("token"));

      // 🔹 Decodificar token para ver tipo de usuario
      const decodedToken = jwtDecode(data.token);
      console.log("TOKEN DECODIFICADO:", decodedToken);

      const tipoUsuario = (decodedToken as any).tipo_usuario;
      console.log("TIPO DE USUARIO:", tipoUsuario);
      console.log("Id", decodedToken.sub)

      // Ejemplo: redirigir según tipo de usuario
      if (tipoUsuario === 0) router.push("/Patient/home");
      else if (tipoUsuario === 1) router.push("/Doctor/homeDoctor");
      else router.push("/Receptionist/home");

    } catch (error) {
      console.error("Error en login:", error);
      setErrorMessage("Error de conexión con el servidor");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image src="/icon.svg" alt="icon" width={200} height={200} />
        <p>CDLG</p>
        <p>Recuerda que al crear tu cuenta, se te asignará un número de seguridad social al correo que proporcionaste</p>
      </div>
      <div className={styles.right}>
        <Form
          inputs={
            <>
              <TextInput
                placeHolder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                placeHolder="Contraseña"
                value={password}
                onChangeText={setPassword}
                security={true}
              />
              {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            </>
          }
          buttons={
            <>
              <IconButton text="Iniciar sesión" onPress={handleLogin}>
                <CardiologyIcon size={30} />
              </IconButton>

              <IconButton text="Crear Cuenta" onPress={() => router.push("/Patient/register")}>
                <CardiologyIcon size={30} />
              </IconButton>
            </>
          }
        />
      </div>
    </div>
  );
}
