import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, ChevronDown, Wallet, TrendingUp, CreditCard, Coffee, ShoppingBag, Home, Truck, Utensils, Zap, ArrowDown, ArrowUp, User, Settings, Plus, Filter } from 'lucide-react';

// Données d'exemple pour David Vuong
const userData = {
  name: "David Vuong",
  email: "david.vuong@example.com",
  balance: 2845.75,
  currency: "€",
  profileImage: "/api/placeholder/40/40"
};

// Catégories améliorées avec couleurs et budgets
const categories = [
  { id: 1, name: "Alimentation", icon: <Utensils size={20} />, color: "#4F46E5", bgColor: "#EEF2FF", budget: 350, spent: 280 },
  { id: 2, name: "Transport", icon: <Truck size={20} />, color: "#4F46E5", bgColor: "#EEF2FF", budget: 120, spent: 85 },
  { id: 3, name: "Logement", icon: <Home size={20} />, color: "#4F46E5", bgColor: "#EEF2FF", budget: 800, spent: 800 },
  { id: 4, name: "Shopping", icon: <ShoppingBag size={20} />, color: "#4F46E5", bgColor: "#EEF2FF", budget: 150, spent: 120 },
  { id: 5, name: "Café", icon: <Coffee size={20} />, color: "#4F46E5", bgColor: "#EEF2FF", budget: 80, spent: 65 }
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
        description: `Dépense ${categories[categoryIndex].name}`,
        time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`
      });
    }
  }
  return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Création de données de revenus pour les 30 derniers jours
const generateIncome = () => {
  const income = [];
  for (let i = 0; i < 6; i++) {
    income.push({
      id: i + 1,
      date: formatDate(i * 5),
      amount: Math.floor(Math.random() * 1000) + 500,
      source: ["Salaire", "Freelance", "Remboursement", "Cadeau"][Math.floor(Math.random() * 4)],
      description: "Revenu mensuel"
    });
  }
  return income.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const expenses = generateExpenses();
const income = generateIncome();

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
  })).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-10);
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
    date: week,
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
    date: month,
    amount: months[month]
  }));
};

// Données pour les évolutions par rapport au mois dernier
const getTrendData = () => {
  const incomeByDay = {};
  const expenseByDay = {};
  
  income.forEach(inc => {
    if (!incomeByDay[inc.date]) {
      incomeByDay[inc.date] = 0;
    }
    incomeByDay[inc.date] += inc.amount;
  });
  
  expenses.forEach(expense => {
    if (!expenseByDay[expense.date]) {
      expenseByDay[expense.date] = 0;
    }
    expenseByDay[expense.date] += expense.amount;
  });
  
  // Créer une liste de tous les jours
  const allDates = [...new Set([...Object.keys(incomeByDay), ...Object.keys(expenseByDay)])].sort();
  
  // Créer les données de tendance
  return allDates.slice(-15).map(date => ({
    date,
    revenu: incomeByDay[date] || 0,
    dépense: expenseByDay[date] || 0,
    solde: (incomeByDay[date] || 0) - (expenseByDay[date] || 0)
  }));
};

const dailyData = getDailyData();
const weeklyData = getWeeklyData();
const monthlyData = getMonthlyData();
const trendData = getTrendData();

// Calculer les montants totaux et budgets
const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
const totalBudget = categories.reduce((sum, category) => sum + category.budget, 0);

// Statistiques d'évolution par rapport au mois dernier (simulées)
const lastMonthExpenses = totalExpenses * 0.85; // Simulation: les dépenses ont augmenté de 15%
const lastMonthIncome = totalIncome * 0.92; // Simulation: les revenus ont augmenté de 8%
const expenseEvolution = ((totalExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
const incomeEvolution = ((totalIncome - lastMonthIncome) / lastMonthIncome) * 100;

// Application principale
const ExpenseTracker = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Fonction pour obtenir la catégorie
  const getCategory = (categoryId) => {
    return categories.find(c => c.id === categoryId) || 
      { name: 'Inconnu', icon: <CreditCard size={20} />, color: "#4F46E5", bgColor: "#EEF2FF" };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm py-3 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-full transition-all"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="font-semibold">{userData.name}</span>
                <ChevronDown size={16} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} className="mr-2" /> Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings size={16} className="mr-2" /> Paramètres
                  </a>
                  <hr className="my-1" />
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Déconnexion
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 mb-4">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 overflow-x-auto py-2">
            <a href="#" className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-2 whitespace-nowrap">
              Tableau de bord
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 pb-2 whitespace-nowrap">
              Transactions
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 pb-2 whitespace-nowrap">
              Budgets
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 pb-2 whitespace-nowrap">
              Rapports
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 pb-2 whitespace-nowrap">
              Objectifs
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {/* Overview Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Bonjour, David 👋</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium flex items-center shadow-sm hover:bg-gray-700 transition-all">
                <Plus size={18} className="mr-2" /> Ajouter une dépense
              </button>
            </div>
          </div>
        </div>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center mb-3">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <Wallet size={22} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-500">Solde courant</h3>
                <p className="text-2xl font-bold">{userData.currency} {userData.balance.toLocaleString('fr-FR')}</p>
              </div>
            </div>
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${Math.min((userData.balance / 3500) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round((userData.balance / 3500) * 100)}% de votre objectif mensuel
            </p>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center mb-2">
              <div className="bg-red-100 p-3 rounded-full mr-3">
                <ArrowDown size={22} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-500">Dépenses du mois</h3>
                <p className="text-2xl font-bold">{userData.currency} {totalExpenses.toLocaleString('fr-FR')}</p>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <div className={`flex items-center ${expenseEvolution > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {expenseEvolution > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span className="text-sm ml-1 font-medium">{Math.abs(expenseEvolution).toFixed(1)}%</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">par rapport au mois dernier</span>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center mb-2">
              <div className="bg-indigo-100 p-3 rounded-full mr-3">
                <ArrowUp size={22} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-500">Revenus du mois</h3>
                <p className="text-2xl font-bold">{userData.currency} {totalIncome.toLocaleString('fr-FR')}</p>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <div className={`flex items-center ${incomeEvolution > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {incomeEvolution > 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span className="text-sm ml-1 font-medium">{Math.abs(incomeEvolution).toFixed(1)}%</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">par rapport au mois dernier</span>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-3 rounded-full mr-3">
                <Calendar size={22} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-500">Transactions</h3>
                <p className="text-2xl font-bold">{expenses.length}</p>
              </div>
            </div>
            <div className="flex items-center mt-1">
              <div className="flex items-center text-blue-500">
                <span className="text-sm font-medium">{expenses.slice(0, 7).length} transactions</span>
              </div>
              <span className="text-xs text-gray-500 ml-2">ces 7 derniers jours</span>
            </div>
          </div>
        </div>

{/* Budget Section */}
<div className="bg-white p-5 rounded-xl shadow-md mb-6 border border-gray-100">
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-xl font-bold text-gray-900">Budget mensuel</h2>
    <button className="text-gray-800 hover:bg-gray-800 hover:text-white text-sm font-medium border border-gray-300 px-3 py-1 rounded-md transition-colors">
      Modifier les budgets
    </button>
  </div>
  
  <div className="flex flex-col md:flex-row md:items-center mb-6">
    <div className="flex-1 mb-4 md:mb-0">
      <div className="flex items-end">
        <p className="text-3xl font-bold text-gray-900">{userData.currency} {totalExpenses.toLocaleString('fr-FR')}</p>
        <p className="text-gray-500 ml-2 mb-1">/ {userData.currency} {totalBudget.toLocaleString('fr-FR')}</p>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full mt-3 mb-1 shadow-inner">
        <div
          className={`h-full rounded-full ${totalExpenses / totalBudget < 0.8 ? 'bg-gray-700' : 'bg-gray-900'}`}
          style={{ width: `${Math.min((totalExpenses / totalBudget) * 100, 100)}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">
        {Math.round((totalExpenses / totalBudget) * 100)}% de votre budget utilisé
      </p>
    </div>
    <div className="grid grid-cols-2 gap-4 md:w-1/3">
      <div className="bg-gray-100 p-3 rounded-lg text-center shadow-sm">
        <p className="text-gray-600 text-sm mb-1">Restant</p>
        <p className="text-lg font-bold text-gray-900">{userData.currency} {Math.max(totalBudget - totalExpenses, 0).toLocaleString('fr-FR')}</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-lg text-center shadow-sm">
        <p className="text-gray-600 text-sm mb-1">Économies</p>
        <p className={`text-lg font-bold ${totalIncome - totalExpenses > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
          {userData.currency} {Math.abs(totalIncome - totalExpenses).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
    {categories.map(category => (
      <div key={category.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="p-2 rounded-full mr-2 bg-white shadow-sm">
              {category.icon}
            </div>
            <h4 className="font-medium text-gray-900">{category.name}</h4>
          </div>
          <p className="text-sm text-gray-600">
            {userData.currency} {category.spent} / {userData.currency} {category.budget}
          </p>
        </div>
        <div className="w-full h-2 bg-gray-300 rounded-full mb-1">
          <div
            className="h-full rounded-full bg-gray-800"
            style={{ width: `${Math.min((category.spent / category.budget) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{Math.round((category.spent / category.budget) * 100)}% utilisé</span>
          <span>Reste: {userData.currency} {Math.max(category.budget - category.spent, 0)}</span>
        </div>
      </div>
    ))}
  </div>
</div>
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Chart Section */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Évolution des dépenses</h2>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 text-sm rounded-lg transition-all ${activeTab === 'daily' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('daily')}
                  >
                    Jour
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded-lg transition-all ${activeTab === 'weekly' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('weekly')}
                  >
                    Semaine
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded-lg transition-all ${activeTab === 'monthly' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    onClick={() => setActiveTab('monthly')}
                  >
                    Mois
                  </button>
                </div>
              </div>
              
              <div className="h-80">
                {activeTab === 'daily' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => [`${userData.currency} ${value}`, 'Montant']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#4F46E5" 
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                        strokeWidth={2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                
                {activeTab === 'weekly' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => [`${userData.currency} ${value}`, 'Montant']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#4F46E5" 
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                        strokeWidth={2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                
                {activeTab === 'monthly' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        formatter={(value) => [`${userData.currency} ${value}`, 'Montant']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#4F46E5" 
                        fillOpacity={1} 
                        fill="url(#colorAmount)" 
                        strokeWidth={2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 rounded-xl shadow-sm text-white">
              <div className="flex items-center mb-3">
                <Zap size={24} className="mr-2" />
                <h2 className="text-lg font-bold">Conseil du jour</h2>
              </div>
              <p className="mb-4">Économisez jusqu'à 15% sur vos dépenses alimentaires en planifiant vos repas à l'avance.</p>
              <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-opacity-90 transition-all">
                Découvrir plus
              </button>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Transactions récentes</h2>
                <button className="text-indigo-600 hover:underline text-sm font-medium">
                  Voir tout
                </button>
              </div>
              
              <div className="space-y-3">
                {expenses.slice(0, 5).map(expense => {
                  const category = getCategory(expense.category);
                  return (
                    <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full mr-3" style={{ backgroundColor: category.bgColor }}>
                          {category.icon}
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-gray-500">{expense.date} • {expense.time}</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-500">-{userData.currency} {expense.amount}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 mt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800">ExpenseTracker</h2>
              <p className="text-sm text-gray-500">La meilleure façon de gérer vos finances</p>
            </div>
            <div className="flex space-x-8">
              <div>
                <h3 className="font-medium mb-2">Produit</h3>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li><a href="#" className="hover:text-indigo-600">Fonctionnalités</a></li>
                  <li><a href="#" className="hover:text-indigo-600">Tarification</a></li>
                  <li><a href="#" className="hover:text-indigo-600">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Support</h3>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li><a href="#" className="hover:text-indigo-600">Centre d'aide</a></li>
                  <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
                  <li><a href="#" className="hover:text-indigo-600">Communauté</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-6 pt-6 text-center text-sm text-gray-500">
            <p>© 2025 ExpenseTracker. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExpenseTracker;