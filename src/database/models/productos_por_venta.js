'use strict';

module.exports = (sequelize, DataTypes) => {

let alias = "Productos_por_venta";
 let cols = {
   id: {type: DataTypes.INTEGER,
      autoIncrement : true,
      primaryKey : true,
      notNull : true,
      
 },
    cantidad: {type: DataTypes.INTEGER, notNull : true  },
    talle: {type: DataTypes.STRING(25), notNull : true},
    color: {type: DataTypes.STRING(50), notNull : true },
    precio_unitario: {type: DataTypes.DECIMAL, notNull : true},
    id_producto: {type: DataTypes.INTEGER, notNull : true},
    id_venta: {type: DataTypes.INTEGER, },
   
        };
 let config =  {
    tableName : 'productos_por_venta',
    timestamps : false
              }; 

    const Productos_por_venta = sequelize.define(alias, cols, config);

   Productos_por_venta.associate = function (models) {
    Productos_por_venta.belongsTo (models.Ventas, {   // muchos detalles de productos_por_venta pertenecen a una venta
            as : "ventas",                    
            foreignKey : "id_venta"
         });

      Productos_por_venta.belongsTo(models.Productos, {  // muchos detalles de productos_por_venta pertenecen a un prodcuto
      as: "productos",
      foreignKey: "id",
      });
     

   }

 	return Productos_por_venta;
};

