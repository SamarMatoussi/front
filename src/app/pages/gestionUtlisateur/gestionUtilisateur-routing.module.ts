import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionUtilisateurComponent} from "./list/list.component"; 


const routes: Routes = [
   {
    path:"list",
    component:GestionUtilisateurComponent
   },
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GestionUtilisateurRoutingModule {}
