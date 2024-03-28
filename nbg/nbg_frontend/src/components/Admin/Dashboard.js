import React from "react";
import GameForm from "./GameForm";
import CategoryForm from "./CategoryForm";
import MechanicsForm from "./MechanicsForm";
import ThemeForm from "./ThemeForm";

const Dashboard = () => {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Painel Administrativo</h1>
      <div>
        <GameForm />
        <CategoryForm />
        <MechanicsForm />
        <ThemeForm />
      </div>
    </div>
  );
};

export default Dashboard;