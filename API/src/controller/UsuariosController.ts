import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuarios } from "../entity/Usuario";


class UsuariosController {
  static getAll = async (req: Request, resp: Response) => {
    try {
      const repoUsuario = AppDataSource.getRepository(Usuarios);
      const listaUsuario = await repoUsuario.find({ where: { estado: true } });

      if (listaUsuario.length == 0) {
        return resp
          .status(404)
          .json({ mensaje: "La base de datos se encuentra vacia" });
      }

      return resp.status(200).json(listaUsuario);
    } catch (error) {
      return resp
        .status(400)
        .json({ mensaje: "Error" });
    }
  };


  static add = async (req: Request, resp: Response) => {
    try {
      const { cedula, nombre, apellido1, apellido2, correo, rol, contrasena } =
        req.body;

      // typescript
      const fecha = new Date();

      let usuario = new Usuarios();
      usuario.cedula = cedula;
      usuario.nombre = nombre;
      usuario.apellido1 = apellido1;
      usuario.apellido2 = apellido2;
      usuario.fecha_ingreso = fecha;
      usuario.correo = correo;
      usuario.contrasena = contrasena;
      usuario.rol = rol;
      usuario.estado = true;

      const repoUsuario = AppDataSource.getRepository(Usuarios);
      let usuarioExist = await repoUsuario.findOne({
        where: { cedula: cedula, estado: true },
      });
      if (usuarioExist) {
       return resp.status(400).json({ mensaje: "El usuario existe dentro de la base de datos" });
      }

      // validando que el correo no este registrado a algun usuario ya creado
      usuarioExist = await repoUsuario.findOne({ where: { correo: correo } });
      if (usuarioExist) {
        return resp
          .status(400)
          .json({ mensaje: "Ya existe un usuario con ese correo" });
      }
      try {
        await repoUsuario.save(usuario);
        return resp.status(201).json({ mensaje: "Se ha creado correctamente el usuario" });
      } catch (error) {
        resp.status(400).json(error);
      }
    } catch (error) {
      return resp.status(400).json({ mensaje: "Error" });
    }
  };

  static update = async (req: Request, resp: Response) => {
    
    const { cedula, nombre, apellido1, apellido2, correo, rol, contrasena, fecha_ingreso } =
        req.body;

    //validacion de reglas de negocio
    const UsuariosRepo = AppDataSource.getRepository(Usuarios);
    let usua: Usuarios;
    try {
      usua = await UsuariosRepo.findOneOrFail({ where: { cedula } });
    } catch (error) {
      return resp.status(404).json({ mensaje: "No existe ese usuario." });
    }

    usua.nombre = nombre;
    usua.apellido1 = apellido1;
    usua.apellido2 = apellido2;
    usua.correo = correo;
    usua.rol = rol;
    usua.contrasena = contrasena;
    usua.fecha_ingreso = fecha_ingreso;


  
    try {
      await UsuariosRepo.save(usua);
      return resp.status(200).json({ mensaje: "Se modifico correctamente" });
    } catch (error) {
      return resp.status(400).json({ mensaje: "No se pudo modificar" });
    }

  };

  static delete = async (req: Request, resp: Response) => {
    
    try {
      const cedula = req.params["cedula"];
      if (!cedula) {
        return resp.status(404).json({ mensaje: "Se debe de indicar la cedula" });
      }

      const UsuariosRepo = AppDataSource.getRepository(Usuarios);
      let usua: Usuarios;
      try {
        usua = await UsuariosRepo.findOneOrFail({
          where: {cedula, estado: true },
        });
      } catch (error) {
        return resp
          .status(404)
          .json({ mensaje: "No se encuentra el usuario con esa cedula" });
      }

      usua.estado = false;
      try {
        await UsuariosRepo.save(usua);
        return resp.status(200).json({ mensaje: "Se eliminó correctamente" });
      } catch (error) {
        return resp.status(400).json({ mensaje: "No se pudo eliminar." });
      }
    } catch (error) {
      return resp.status(400).json({ mensaje: "Error de eliminar" });
    }

  };

}

export default UsuariosController;
