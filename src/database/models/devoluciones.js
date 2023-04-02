'use strict';

module.exports = (sequelize, DataTypes) => {

let alias = "Devoluciones";
 let cols = {
    id: {type: DataTypes.INTEGER,
         autoIncrement : true,
         primaryKey : true,
         notNull : true
    },
    fecha: {type: DataTypes.DATE, notNull : true},
    id_usuario: {type: DataTypes.INTEGER},
    id_producto: {type: DataTypes.INTEGER, notNull : true },
    numero_factura: {type: DataTypes.INTEGER, notNull : true },
    nombre_y_apellido: {type: DataTypes.STRING(65),notNul : true},
    email: {type: DataTypes.STRING(65), notNull: true}, 
        };
 let config =  {
    tableName : 'devoluciones',
    timestamps : false
              }; 

    const devolucion = sequelize.define(alias, cols, config);

   devolucion.associate = function (models) {
         devolucion.belongsTo (models.Ventas, { // muchas devoluciones pertenecen (pueden pertenecer) a una venta
            as : "ventas",                    
            foreignKey : "numero_factura"
         });

      devolucion.belongsTo(models.Productos, {  // muchas devoluciones pertenecen a un producto
      as: "productos",
      foreignKey: "id",
      });

	devolucion.belongsTo(models.Usuarios, {   // muchas devoluciones pertenecen a un usuario
      as: "usuarios",
      foreignKey: "id",
      });

   }

 	return devolucion;
};