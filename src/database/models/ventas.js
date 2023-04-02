'use strict';

module.exports = (sequelize, DataTypes) => {

let alias = "Ventas";
 let cols = {
    numero_factura: {type: DataTypes.INTEGER,
         autoIncrement : true,
         primaryKey : true,
         notNull : true
    },

    fecha: {type: DataTypes.DATE, notNull : true},
    id_usuario: {type: DataTypes.INTEGER, notNull : true},
    total: {type: DataTypes.DECIMAL, notNull : true },
 
   
        };
 let config =  {
    tableName : 'ventas',
    timestamps : false
              }; 

    const venta = sequelize.define(alias, cols, config);

   venta.associate = function (models) {
         venta.hasMany (models.Devoluciones, { // una venta tiene muchas devoluciones
            as : "devoluciones",                    
            foreignKey : "id"
         })

      venta.belongsTo(models.Usuarios, {  // muchas ventas pertenecen a un ususrio
      as: "usuarios",
      foreignKey: "id",
      });

      venta.hasMany(models.Productos_por_venta, {  // una venta tiene muchos productos_por_venta
         as: "productos_por_venta",
         foreignKey: "id_venta",
      });

   }

 	return venta;
};