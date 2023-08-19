import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { Usuarios } from 'src/app/shared/models/usuarios';
import { UsuariosService } from 'src/app/shared/services/usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [DatePipe]
})
export class UsuariosComponent {

  displayedColumns: string[] = ['cedula', 'nombre', 'apellido1',
  'apellido2','rol','correo','contrasena','acciones'];
  dataSource = new MatTableDataSource();

  constructor(private srvUsuarios: UsuariosService, public dialog: MatDialog,
    private datePipe: DatePipe){

  }
  ngOnInit(){
    this.srvUsuarios.getAll().subscribe((datos) => {
      this.dataSource.data = datos;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  eliminar(cedula:string):void{
    this.srvUsuarios.eliminar(cedula).subscribe((dato) =>{
      alert("SE ELIMINO EL USUARIO CORRECTAMENTE")
      window.location.reload(); 
    },(error)=>{
      alert("ERROR AL ELIMINAR USUARIO, VUELVA A INTENTARLO ")
    })
  }

  detalle(dato:Usuarios):void{

    let mensaje = `
    Cedula: ${dato.cedula}
    Nombre: ${dato.nombre}
    Apellido1: ${dato.apellido1}
    Apellido2: ${dato.apellido2}
    Fecha Ingreso: ${this.datePipe.transform(dato.fecha_ingreso, 'shortDate')}
    Correo: ${dato.correo}
    Rol: ${dato.rol}
    Contraseña: ${dato.contrasena}
    Estado: ${dato.estado}
  `;
  alert(mensaje);
  }
 
  abrirDialog(usuario?:Usuarios):void{
    if(usuario){
      this.dialog.open(AdminUsuariosComponent, {width:'700px', height:'700px', data:{usuario}});
    }else{
      this.dialog.open(AdminUsuariosComponent, {width:'700px', height:'700px'});
    }
  }
}
