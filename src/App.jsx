import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, ChevronDown, Wallet, TrendingUp, CreditCard, Coffee, ShoppingBag, Home, Truck, Utensils } from 'lucide-react';

// Données d'exemple pour David Vuong
const userData = {
  name: "David Vuong",
  email: "david.vuong@example.com",
  balance: 2845.75,
  currency: "€"
};

// Génération de dépenses aléatoires pour les 30 derniers jours
const categories = [
  { id: 1, name: "Alimentation", icon: <Utensils size={18} /> },
  { id: 2, name: "Transport", icon: <Truck size={18} /> },
  { id: 3, name: "Logement", icon: <Home size={18} /> },
  { id: 4, name: "Shopping", icon: <ShoppingBag size={18} /> },
  { id: 5, name: "Café", icon: <Coffee size={18} /> }
];

// Fonction pour obtenir une date formatée
const formatDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Création de données de dépenses pour les 30 derniers jours
const generateExpenses = () => {
  const expenses = [];
  for (let i = 0; i < 30; i++) {
    const numExpenses = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < numExpenses; j++) {
      const categoryIndex = Math.floor(Math.random() * categories.length);
      expenses.push({
        id: expenses.length + 1,
        date: formatDate(i),
        amount: Math.floor(Math.random() * 50) + 5,
        category: categories[categoryIndex].id,
        description: `Dépense ${categories[categoryIndex].name}`
      });
    }
  }
  return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const expenses = generateExpenses();

// Préparation des données pour les graphiques
const getDailyData = () => {
  const dailyTotals = {};
  
  expenses.forEach(expense => {
    if (!dailyTotals[expense.date]) {
      dailyTotals[expense.date] = 0;
    }
    dailyTotals[expense.date] += expense.amount;
  });
  
  return Object.keys(dailyTotals).map(date => ({
    date,
    amount: dailyTotals[date]
  })).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-7);
};

const getWeeklyData = () => {
  const weeks = {};
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const weekNum = Math.floor((date.getDate() - 1) / 7) + 1;
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    const weekKey = `S${weekNum} ${monthYear}`;
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = 0;
    }
    weeks[weekKey] += expense.amount;
  });
  
  return Object.keys(weeks).map(week => ({
    name: week,
    amount: weeks[week]
  })).slice(-4);
};

const getMonthlyData = () => {
  const months = {};
  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    if (!months[monthKey]) {
      months[monthKey] = 0;
    }
    months[monthKey] += expense.amount;
  });
  
  return Object.keys(months).map(month => ({
    name: month,
    amount: months[month]
  }));
};

const getCategoryData = () => {
  const categoryTotals = {};
  
  expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });
  
  return Object.keys(categoryTotals).map(categoryId => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    return {
      name: category.name,
      value: categoryTotals[categoryId]
    };
  });
};

const dailyData = getDailyData();
const weeklyData = getWeeklyData();
const monthlyData = getMonthlyData();
const categoryData = getCategoryData();

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Application principale
const ExpenseTracker = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [showDropdown, setShowDropdown] = useState(false);

  // Calcul du total des dépenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Inconnu';
  };
  
  // Fonction pour obtenir l'icône de la catégorie
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.icon : <CreditCard size={18} />;
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">ExpenseTracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="flex items-center space-x-1 bg-gray-100 px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-all"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span>{userData.name}</span>
                <ChevronDown size={16} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Déconnexion</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Wallet size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Solde</h3>
                <p className="text-xl font-bold">{userData.currency} {userData.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-3 rounded-full mr-3">
                <CreditCard size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Dépenses totales</h3>
                <p className="text-xl font-bold">{userData.currency} {totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-2">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <Calendar size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Transactions</h3>
                <p className="text-xl font-bold">{expenses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Visualisation des dépenses</h2>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 text-sm rounded-full transition-all ${activeTab === 'daily' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('daily')}
                >
                  Jour
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full transition-all ${activeTab === 'weekly' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('weekly')}
                >
                  Semaine
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full transition-all ${activeTab === 'monthly' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('monthly')}
                >
                  Mois
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-full transition-all ${activeTab === 'category' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => setActiveTab('category')}
                >
                  Catégorie
                </button>
              </div>
            </div>
            
            <div className="h-64">
              {activeTab === 'daily' && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${userData.currency} ${value}`, 'Montant']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
              
              {activeTab === 'weekly' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${userData.currency} ${value}`, 'Montant']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {activeTab === 'monthly' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => [`${userData.currency} ${value}`, 'Montant']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="amount" fill="#0088FE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {activeTab === 'category' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${userData.currency} ${value}`, 'Montant']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Transactions récentes</h2>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all">
                Voir tout
              </button>
            </div>
            
            <div className="space-y-3">
              {expenses.slice(0, 5).map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-2 rounded-full mr-3">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                      <p className="font-medium">{getCategoryName(expense.category)}</p>
                      <p className="text-sm text-gray-500">{expense.date}</p>
                    </div>
                  </div>
                  <p className="font-bold text-red-500">-{userData.currency} {expense.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© 2025 ExpenseTracker. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default ExpenseTracker;