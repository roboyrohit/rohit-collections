import React from "react";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import styles from "./contact.module.scss";

export default function Contact() {
  return (
    <div className={styles.contactDiv}>
      <Card
        title="Contact Us"
        subTitle="We'd love to hear from you! Please reach out using the details below or send us a message."
        className={styles.infoDiv}
      >
        <Divider />
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>:</th>
              <td>Rohit Mehra</td>
            </tr>
            <tr>
              <th>E-mail</th>
              <th>:</th>
              <td>roboyrohitmehra@gmail.com</td>
            </tr>
            <tr>
              <th>Phone</th>
              <th>:</th>
              <td>+91 79058 94101</td>
            </tr>
            <tr>
              <th>Address</th>
              <th>:</th>
              <td>85/2, First Floor, Luz Avenue, Chennai, India</td>
            </tr>
          </tbody>
        </table>
        <Divider />
        <form>
          <InputText
            placeholder="Your Name"
          />
          <InputText
            placeholder="Your Email"
          />
          <InputText
            placeholder="Your Message"
          />
          <Button label="SEND" icon="pi pi-send" />
        </form>
      </Card>
    </div>
  );
}
