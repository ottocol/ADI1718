# Instalación de Node

En lugar de instalar directamente Node vamos a ver aquí cómo instalar un **sistema de gestión de versiones de Node llamado `nvm`**. Este sistema nos permite tener varias versiones de Node instaladas de manera simultánea en nuestra máquina, dándonos dos ventajas:

- Podemos usar una versión de node distinta para cada proyecto, o bien probar una versión nueva sin necesidad de desinstalar la anterior ni afectar a los proyectos que la usaban
- Evitamos problemas con los permisos de escritura del directorio donde se instalan los paquetes globales de Node. En muchas instalaciones se acaba haciendo la instalación de estos paquetes en modo superusuario, pero eso siempre acaba dando problemas en sistemas UNIX.

Nosotros no vamos a usar múltiples versiones de Node, pero solo por solucionar el segundo problema ya nos merece la pena usar `nvm`.

## Linux/Mac

Las instrucciones completas las tenéis en la [página de `nvm`](https://github.com/creationix/nvm). De manera muy resumida, basta con teclear en una terminal:

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
```

Ahora **cerramos la terminal y volvemos a abrir otra nueva** y a partir de entonces estará disponible el comando `nvm`, que sirve para instalar y gestionar las versiones de node propiamente dicho. Por ejemplo para instalar la última versión estable de node tecleamos:

```bash
nvm install stable
```

y a partir de entonces ya podríamos usar los comandos `node` y `npm`. 

```bash
node -v   #imprime la versión de node
v6.7.0    #última versión estable en el momento de escribir esto
```

Si habéis tenido un problema de instalación o queréis ver cómo especificar la versión de node por defecto para el directorio actual teniendo instaladas varias versiones, tenéis la información en el [sitio de `nvm`](https://github.com/creationix/nvm).

## Windows

Hay una versión de la herramienta [`nvm` para windows](https://github.com/coreybutler/nvm-windows). Se instala mediante un [instalador gráfico](https://github.com/coreybutler/nvm/releases).

Una vez instalado `nvm` para Windows, abriríamos una terminal y al igual que en Linux/Mac haríamos:

```bash
nvm install stable
```

También podéis consultar la [lista completa de comandos](https://github.com/coreybutler/nvm-windows#usage) de `nvm`.



