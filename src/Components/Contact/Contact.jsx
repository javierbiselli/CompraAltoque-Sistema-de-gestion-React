import styles from "./contact.module.css";
import emailjs from "emailjs-com";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loader from "../Shared/Loader/Loader";
import Modal from "../Shared/Modal/Modal";
import Input from "../Shared/Input/Input";

const Contact = () => {
  const userEmail = JSON.parse(window.sessionStorage.getItem("userData")).email;
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const schema = Joi.object({
    email: Joi.string().allow(),
    message: Joi.string().required().messages({
      "string.empty": "Escribi un mensaje",
    }),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: joiResolver(schema),
  });

  const sendEmail = async (data) => {
    setIsLoading(true);
    data.email = userEmail;
    emailjs
      .send("service_g2le82c", "template_ygrdrbb", data, "V61t4y1LnMzqdr-T4")
      .then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          setShowModal(true);
        } else {
          alert(res.text);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className={styles.contactContainer} id="Contact">
      <div id="ContactSection" className={styles.contactSectionScroll}></div>
      <form onSubmit={handleSubmit(sendEmail)}>
        <h4>Contacto</h4>
        <label htmlFor="email">Email</label>
        <Input
          type={"email"}
          name={"email"}
          value={userEmail}
          register={register}
          error={errors.email?.message}
          disabled
        />
        <div className={styles.textArea}>
          <label htmlFor="message">Mensaje</label>
          <textarea name="message" {...register("message")}></textarea>
          <div className={styles.loadingContainer}>
            <Loader show={isLoading} />
            <input
              type="submit"
              value="Enviar"
              className={styles.submitButton}
            />
          </div>
          <div>
            <p>
              Si te contactás por algún error o problema con el sistema de
              gestión:
            </p>
            <p>
              Contanos cuál fue el incoveniente, y si hay algún mensaje de
              error, incluilo; te responderemos en la brevedad. Tené en cuenta
              que este sistema está en desarrollo y pueden haber errores o
              problemas que se corrigen a medida que los vamos encontrando
            </p>
            <p>Si te contactás para cambiar los datos de tu negocio:</p>
            <p>
              Incluí los datos originales y como los queres cambiar, por
              ejemplo:
            </p>
            <p>datos originales:</p>
            <p>
              horarios: de lunes a viernes de 9 a 17 horas; información extra:
              envíos a toda la ciudad
            </p>
            <p>datos nuevos:</p>
            <p>
              horarios: de lunes a sábados de 9 a 15, información extra: ninguna
            </p>
            <p>
              Los cambios pueden tardar en reflejarse hasta 48 horas hábiles
            </p>
          </div>
          <div className={styles.error}>{errors.message?.message}</div>
        </div>
      </form>
      <Modal
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
        closeButton="OK"
      >
        Mensaje enviado
      </Modal>
    </section>
  );
};

export default Contact;
