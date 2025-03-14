const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determina si usar SQLite o PostgreSQL
const useSQLite = process.env.USE_SQLITE === 'true';

// Imprime información de depuración
console.log('Configuración de BD:', {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  passwordProvided: !!process.env.DB_PASSWORD
});

let sequelize;

if (useSQLite) {
  // Configuración para SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });
  console.log('Usando SQLite para desarrollo');
} else {
  // Configuración para PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    return false;
  }
};

// Exporta directamente la instancia de Sequelize
module.exports = sequelize;