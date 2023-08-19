import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";
import { Column, Entity, PrimaryColumn, Unique } from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
export class Usuarios {
  @PrimaryColumn()
  @IsNotEmpty({ message: "DEBES DE INDICAR EL LA CÉDULA DEL USUARIO " })
  cedula: string;

  @Column({ length: 50 })
  @MaxLength(50)
  @IsNotEmpty({ message: "DEBES INDICAR EL NOMBRE DEL USUARIO " })
  nombre: string;

  @Column()
  @MaxLength(50)
  @IsNotEmpty({ message: "DEBES INDICAR EL PRIMER APELLIDO " })
  apellido1: string;

  @Column()
  @MaxLength(50)
  @IsNotEmpty({ message: "DEBES DE INDICAR EL SEGUNDO APELLIDO " })
  apellido2: string;

  @Column()
  @IsNotEmpty({ message: "DEBES DE INDICAR LA FECHA " })
  fecha_ingreso: Date;

  @Column({ unique: true })
  @IsNotEmpty({ message: "DEBES DE INDICAR EL CORREO ELECTRÓNICO " })
  @MaxLength(50)
  correo: string;

  @Column()
  @IsNotEmpty({ message: "DEBES DE INDICAR EL ROL" })
  rol: string;

  @Column()
  @MaxLength(18)
  @MinLength(5)
  @IsNotEmpty({ message: "DEBES DE INDICAR LA CONTRASEÑA " })
  contrasena: string;

  @Column({ default: true })
  estado: boolean;

  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.contrasena = bcrypt.hashSync(this.contrasena, salt);
  }

  checkPassword(contra: string): boolean {
    return bcrypt.compareSync(contra, this.contrasena);
  }
}
