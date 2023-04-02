'use strict';

module.exports = (sequelize, DataTypes) => {

let alias = "Productos_por_venta";
 let cols = {
    cantidad: {type: DataTypes.INTEGER, notNull : true  },

    precio_unitario: {type: DataTypes.DECIMAL, notNull : true},
    id_producto: {type: DataTypes.INTEGER, notNull : true},
    id_venta: {type: DataTypes.INTEGER, notNull : true },
        };
 let config =  {
    tableName : 'productos_por_venta',
    timestamps : false
              }; 

    const productos_por_venta = sequelize.define(alias, cols, config);

   productos_por_venta.associate = function (models) {
    productos_por_venta.belongsTo (models.Ventas, {   // muchos detalles de productos_por_venta pertenecen a una venta
            as : "ventas",                    
            foreignKey : "numero_factura"
         });

      productos_por_venta.belongsTo(models.Productos, {  // muchos detalles de productos_por_venta pertenecen a un prodcuto
      as: "productos",
      foreignKey: "id",
      });
     

   }

 	return productos_por_venta;
};

