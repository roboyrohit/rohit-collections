import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";

export default function Home() {
  return (
    <Card unstyled="false" subTitle={<span className="pageTitle">Home</span>}>
      <Card className="pageContent">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <Card
            title="Welcome to Rohit Collections"
            subTitle="Your hub for movies, series, and more!"
            style={{
              width: "400px",
              textAlign: "center",
              animation: "fadeIn 1.2s",
            }}
          >
            <p>
              Discover, bookmark, and manage your favourite collections with a
              beautiful, modern UI.
            </p>
            <Button
              label="Explore Now"
              icon="pi pi-search"
              className="p-button-raised p-button-info"
              style={{ marginTop: "1rem", position: "relative" }}
            >
              <Ripple />
            </Button>
          </Card>
          <style>
            {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(40px);}
                    to { opacity: 1; transform: translateY(0);}
                }
            `}
          </style>
        </div>
      </Card>
    </Card>
  );
}
