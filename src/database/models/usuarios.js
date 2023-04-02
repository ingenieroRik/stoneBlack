'use strict';


module.exports = (sequelize, DataTypes) => {
    let alias = 'Usuarios';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre_y_apellido: {
            type: DataTypes.STRING(45),
            notNul : true
        },
        nombre_usuario: {
            type: DataTypes.STRING(45),
            notNull: true
        },
        email: {
            type: DataTypes.STRING(60),
            notNull: true,
            //unique :true     <----------- ver como manejar este error
        },
        clave: {
		    type: DataTypes.STRING(255),
	   	    notNull: true
	    },
        rol: {
            type: DataTypes.STRING(25),
        },
        uri_avatar: {
		    type: DataTypes.STRING(1000)	
	    },  
       
        };
    let config = {
        timestamps: false,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false,
        tableName : "usuarios"
    }
    const usuario = sequelize.define(alias, cols, config); 

    usuario.associate = function (models) {
        usuario.hasMany(models.Ventas, {  //un usuario tiene muchas devoluciones
            as: "ventas",
            foreignKey: "id_usuario",      
            });

	 usuario.hasMany(models.Devoluciones, {  // un usuario tiene muchas ventas
            as: "devoluciones",
            foreignKey: "id_usuario",      
            });


        }

    return usuario
};
