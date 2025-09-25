const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Word = sequelize.define('Word', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  palabra: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  pronunciacion_IPA: {
    type: DataTypes.STRING,
    allowNull: true
  },
  explicacion_es: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  audio_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  etiquetas: {
    type: DataTypes.STRING,
    allowNull: true // Storing as a comma-separated string for simplicity
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_ultimo_repaso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nivel_dificultad: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // Represents the initial difficulty level
  },
  proximo_repaso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  extra_reviews_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: false
});

module.exports = Word;