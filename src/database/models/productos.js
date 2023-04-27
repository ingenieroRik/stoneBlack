'use strict';

module.exports = (sequelize, DataTypes) => {

let alias = "Productos";
 let cols = {
    id: {type: DataTypes.INTEGER,
         autoIncrement : true,
         primaryKey : true,
         notNull : true,
         unique : true
    },

    nombre: {type: DataTypes.STRING(45), notNull : true},
    talle: {type: DataTypes.INTEGER, notNull : true},
    color: {type: DataTypes.STRING(50), notNull : true },
    precio: {type: DataTypes.DECIMAL, notNull : true },
    descripcion:{type: DataTypes.STRING(200), notNull: true},
    descuento:{type: DataTypes.DECIMAL, notNull: true},  
    img: {type: DataTypes.STRING(1000) },
    uri_foto2: {type: DataTypes.STRING(1000) },
    uri_foto3: {type: DataTypes.STRING(1000) }
        };
 let config =  {
    tableName : 'productos',
    timestamps : false
              }; 

    const producto = sequelize.define(alias, cols, config);

   producto.associate = function (models) {
         producto.hasMany (models.Productos_por_venta, { 
            as : "producto_por_venta",           // un producto tiene (puede estar en ) muchos detalles de productos_por_venta         
            foreignKey : "id_producto"
         });

      producto.hasMany(models.Devoluciones, {  // un producto tiene (puede estar en ) muchas devoluciones
      as: "devoluciones",
      foreignKey: "id_producto", 
      });
	

   }

 	return producto;
};
