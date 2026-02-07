import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import styles from "./signupPage.module.scss";
import { Divider } from "primereact/divider";

export default function SignupPage({ toggle }) {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Add validation and API call here
    console.log("Signup data:", formData);
  };

  return (
    <div className={styles.signupWrapper}>
      <Card
        title="New To Us"
        subTitle="Create Your Account Instantly"
        className={styles.logincard}
      >
        <form onSubmit={handleSignup} className={styles.signupForm}>
          <div className={styles.field}>
            <label htmlFor="fname">First Name :</label>
            <InputText
              id="fname"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="Minimum 3 characters"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="lname">Last Name :</label>
            <InputText
              id="lname"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Minimum 1 character"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email :</label>
            <InputText
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password :</label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              toggleMask
              feedback={false}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <Password
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              toggleMask
              feedback={false}
              placeholder="••••••••"
            />
          </div>

          <Button
            label="Sign Up"
            icon="pi pi-user-plus"
            type="submit"
            className={styles.signupButton}
          />
        </form>
        <Divider className={styles.divider} />
        <Button
          label="Go To Login Page"
          icon="pi pi-sign-in"
          onClick={toggle}
        // className={styles.signupButton}
        />
      </Card>
    </div>
  );
}
