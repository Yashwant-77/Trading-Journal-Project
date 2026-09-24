
export const calculateStats = (trades) => {
  const closedTrades = trades.filter(
    (trade) =>
      trade.exit_price !== null &&
      trade.exit_price !== undefined
  );

  const winningTrades = closedTrades.filter(
    (trade) => Number(trade.net_pnl || 0) > 0
  );

  const losingTrades = closedTrades.filter(
    (trade) => Number(trade.net_pnl || 0) < 0
  );

  const netPnl = trades.reduce(
    (sum, trade) => sum + Number(trade.net_pnl || 0),
    0
  );

  const grossPnl = trades.reduce(
    (sum, trade) => sum + Number(trade.pnl || 0),
    0
  );

  const totalFees = trades.reduce(
    (sum, trade) =>
      sum +
      Number(trade.entry_fees || 0) +
      Number(trade.exit_fees || 0),
    0
  );

  const grossProfit = winningTrades.reduce(
    (sum, trade) => sum + Number(trade.net_pnl || 0),
    0
  );

  const grossLoss = Math.abs(
    losingTrades.reduce(
      (sum, trade) => sum + Number(trade.net_pnl || 0),
      0
    )
  );

  const winRate =
    closedTrades.length > 0
      ? (winningTrades.length / closedTrades.length) * 100
      : 0;

  const profitFactor =
    grossLoss > 0 ? grossProfit / grossLoss : 0;

  const averageTrade =
    closedTrades.length > 0
      ? netPnl / closedTrades.length
      : 0;

  const averageWin =
    winningTrades.length > 0
      ? grossProfit / winningTrades.length
      : 0;

  const averageLoss =
    losingTrades.length > 0
      ? grossLoss / losingTrades.length
      : 0;

  const largestWin =
    winningTrades.length > 0
      ? Math.max(
          ...winningTrades.map((trade) =>
            Number(trade.net_pnl || 0)
          )
        )
      : 0;

  const largestLoss =
    losingTrades.length > 0
      ? Math.min(
          ...losingTrades.map((trade) =>
            Number(trade.net_pnl || 0)
          )
        )
      : 0;

  return {
    totalTrades: trades.length,
    closedTrades: closedTrades.length,
    openTrades: trades.length - closedTrades.length,

    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,

    netPnl,
    grossPnl,
    totalFees,

    winRate,
    profitFactor,

    averageTrade,
    averageWin,
    averageLoss,

    largestWin,
    largestLoss,
  };
};

// ============================================
// DAILY P&L
// ============================================

export const getDailyPnL = (trades) => {
  const dailyData = {};

  trades.forEach((trade) => {
    if (!trade.entry_date) return;

    const date = new Date(trade.entry_date);

    const key = date.toISOString().split("T")[0];

    if (!dailyData[key]) {
      dailyData[key] = {
        date: key,
        pnl: 0,
        trades: 0,
      };
    }

    dailyData[key].pnl += Number(trade.net_pnl || 0);
    dailyData[key].trades += 1;
  });

  return Object.values(dailyData)
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    )
    .map((item) => ({
      ...item,
      label: new Date(item.date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      ),
    }));
};


// ============================================
// WIN / LOSS DISTRIBUTION
// ============================================

export const getWinLossData = (trades) => {
  let winning = 0;
  let losing = 0;
  let breakeven = 0;

  trades.forEach((trade) => {
    const pnl = Number(trade.net_pnl || 0);

    if (pnl > 0) {
      winning++;
    } else if (pnl < 0) {
      losing++;
    } else {
      breakeven++;
    }
  });

  return [
    {
      name: "Winning",
      value: winning,
    },
    {
      name: "Losing",
      value: losing,
    },
    {
      name: "Breakeven",
      value: breakeven,
    },
  ];
};


// ============================================
// P&L BY PLAYBOOK
// ============================================

export const getPlaybookPnL = (trades) => {
  const playbooks = {};

  trades.forEach((trade) => {

    const playbook =
      trade.playbook?.trim() || "Unknown";

    if (!playbooks[playbook]) {
      playbooks[playbook] = {
        playbook,
        pnl: 0,
        trades: 0,
      };
    }

    playbooks[playbook].pnl += Number(
      trade.net_pnl || 0
    );

    playbooks[playbook].trades += 1;
  });

  return Object.values(playbooks)
    .sort((a, b) => b.pnl - a.pnl);
};


// ============================================
// P&L BY SYMBOL
// ============================================

export const getSymbolPnL = (trades) => {
  const symbols = {};

  trades.forEach((trade) => {

    const symbol =
      trade.symbol?.trim() || "Unknown";

    if (!symbols[symbol]) {
      symbols[symbol] = {
        symbol,
        pnl: 0,
        trades: 0,
      };
    }

    symbols[symbol].pnl += Number(
      trade.net_pnl || 0
    );

    symbols[symbol].trades += 1;
  });

  return Object.values(symbols)
    .sort((a, b) => b.pnl - a.pnl);
};



// ============================================
// EQUITY CURVE
// ============================================

export const getEquityCurve = (trades) => {
  const sortedTrades = [...trades].sort(
    (a, b) =>
      new Date(a.entry_date) -
      new Date(b.entry_date)
  );

  let cumulativePnL = 0;

  return sortedTrades.map((trade, index) => {
    const netPnL = Number(trade.net_pnl || 0);

    cumulativePnL += netPnL;

    return {
      tradeNumber: index + 1,
      date: trade.entry_date,
      pnl: netPnL,
      cumulativePnL,
    };
  });
};


// ============================================
// DRAWDOWN DATA
// ============================================

export const getDrawdownData = (trades) => {
  const equityCurve = getEquityCurve(trades);

  let peak = 0;

  return equityCurve.map((item) => {

    if (item.cumulativePnL > peak) {
      peak = item.cumulativePnL;
    }

    const drawdown =
      item.cumulativePnL - peak;

    return {
      ...item,
      peak,
      drawdown,
    };
  });
};


// ============================================
// MAXIMUM DRAWDOWN
// ============================================

export const getMaxDrawdown = (trades) => {

  const drawdownData =
    getDrawdownData(trades);

  if (drawdownData.length === 0) {
    return 0;
  }

  return Math.min(
    ...drawdownData.map(
      (item) => item.drawdown
    )
  );
};


// ============================================
// WINNING / LOSING STREAKS
// ============================================

export const getStreaks = (trades) => {

  const sortedTrades = [...trades].sort(
    (a, b) =>
      new Date(a.entry_date) -
      new Date(b.entry_date)
  );

  let currentWinStreak = 0;
  let currentLossStreak = 0;

  let maxWinStreak = 0;
  let maxLossStreak = 0;

  sortedTrades.forEach((trade) => {

    const pnl = Number(
      trade.net_pnl || 0
    );

    if (pnl > 0) {

      currentWinStreak++;
      currentLossStreak = 0;

      maxWinStreak = Math.max(
        maxWinStreak,
        currentWinStreak
      );

    } else if (pnl < 0) {

      currentLossStreak++;
      currentWinStreak = 0;

      maxLossStreak = Math.max(
        maxLossStreak,
        currentLossStreak
      );

    } else {

      currentWinStreak = 0;
      currentLossStreak = 0;
    }

  });

  return {
    maxWinStreak,
    maxLossStreak,
  };
};


// ============================================
// EXPECTANCY
// ============================================

export const getExpectancy = (trades) => {

  const closedTrades = trades.filter(
    (trade) =>
      trade.exit_price !== null &&
      trade.exit_price !== undefined
  );

  if (closedTrades.length === 0) {
    return 0;
  }

  const totalPnL = closedTrades.reduce(
    (sum, trade) =>
      sum + Number(trade.net_pnl || 0),
    0
  );

  return totalPnL / closedTrades.length;
};


// ============================================
// PLANNED R:R
//
// SL = amount willing to lose
// TP = amount willing/expecting to make
//
// Planned R:R = TP / SL
// ============================================

export const getAverageRiskReward = (trades) => {

  const validTrades = trades.filter(
    (trade) =>
      Number(trade.sl) > 0 &&
      Number(trade.tp) > 0
  );

  if (validTrades.length === 0) {
    return 0;
  }

  const totalRR = validTrades.reduce(
    (sum, trade) => {

      const risk = Number(trade.sl);
      const reward = Number(trade.tp);

      return sum + reward / risk;
    },
    0
  );

  return totalRR / validTrades.length;
};


// ============================================
// REALIZED R-MULTIPLE
//
// Example:
//
// SL = 300
// Net P&L = 600
//
// Realized R = 600 / 300 = +2R
//
// Loss:
//
// SL = 300
// Net P&L = -150
//
// Realized R = -150 / 300 = -0.5R
// ============================================

export const getAverageRMultiple = (trades) => {

  const validTrades = trades.filter(
    (trade) =>
      Number(trade.sl) > 0
  );

  if (validTrades.length === 0) {
    return 0;
  }

  const totalR = validTrades.reduce(
    (sum, trade) => {

      const risk = Number(trade.sl);
      const netPnL = Number(
        trade.net_pnl || 0
      );

      return sum + netPnL / risk;
    },
    0
  );

  return totalR / validTrades.length;
};


// ============================================
// RECOVERY FACTOR
// ============================================

export const getRecoveryFactor = (trades) => {

  const equityCurve =
    getEquityCurve(trades);

  if (equityCurve.length === 0) {
    return 0;
  }

  const totalPnL =
    equityCurve[
      equityCurve.length - 1
    ].cumulativePnL;

  const maxDrawdown =
    Math.abs(
      getMaxDrawdown(trades)
    );

  if (maxDrawdown === 0) {
    return totalPnL > 0
      ? Infinity
      : 0;
  }

  return totalPnL / maxDrawdown;
};



// ============================================
// P&L BY DAY OF WEEK
// ============================================

export const getDayOfWeekPnL = (trades) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const data = days.map((day) => ({
    day,
    pnl: 0,
    trades: 0,
  }));

  trades.forEach((trade) => {
    if (!trade.entry_date) return;

    const date = new Date(trade.entry_date);

    // JS: Sunday = 0, Monday = 1
    const jsDay = date.getDay();

    // Convert to Monday = 0
    const index = jsDay === 0 ? 6 : jsDay - 1;

    data[index].pnl += Number(
      trade.net_pnl || 0
    );

    data[index].trades += 1;
  });

  return data;
};


// ============================================
// P&L BY HOUR
// ============================================

export const getHourlyPnL = (trades) => {
  const hours = {};

  trades.forEach((trade) => {
    if (!trade.entry_time) return;

    const hour = Number(
      trade.entry_time.split(":")[0]
    );

    if (Number.isNaN(hour)) return;

    if (!hours[hour]) {
      hours[hour] = {
        hour,
        pnl: 0,
        trades: 0,
      };
    }

    hours[hour].pnl += Number(
      trade.net_pnl || 0
    );

    hours[hour].trades += 1;
  });

  return Object.values(hours)
    .sort((a, b) => a.hour - b.hour)
    .map((item) => ({
      ...item,
      label: `${String(item.hour).padStart(2, "0")}:00`,
    }));
};


// ============================================
// LONG VS SHORT
// ============================================

export const getDirectionStats = (trades) => {
  const directions = {
    LONG: {
      direction: "LONG",
      trades: 0,
      winningTrades: 0,
      losingTrades: 0,
      pnl: 0,
      totalR: 0,
      rTrades: 0,
    },

    SHORT: {
      direction: "SHORT",
      trades: 0,
      winningTrades: 0,
      losingTrades: 0,
      pnl: 0,
      totalR: 0,
      rTrades: 0,
    },
  };

  trades.forEach((trade) => {
    const direction =
      String(trade.type || "").toUpperCase();

    if (!directions[direction]) return;

    const pnl = Number(
      trade.net_pnl || 0
    );

    directions[direction].trades += 1;
    directions[direction].pnl += pnl;

    if (pnl > 0) {
      directions[direction].winningTrades += 1;
    } else if (pnl < 0) {
      directions[direction].losingTrades += 1;
    }

    if (Number(trade.sl) > 0) {
      directions[direction].totalR +=
        pnl / Number(trade.sl);

      directions[direction].rTrades += 1;
    }
  });

  return Object.values(directions).map(
    (item) => ({
      ...item,

      winRate:
        item.trades > 0
          ? (item.winningTrades /
              item.trades) *
            100
          : 0,

      averageR:
        item.rTrades > 0
          ? item.totalR /
            item.rTrades
          : 0,
    })
  );
};


// ============================================
// TRADING FREQUENCY
// ============================================

export const getTradingFrequency = (trades) => {

  if (trades.length === 0) {
    return {
      tradingDays: 0,
      averageTradesPerDay: 0,
      averageTradesPerWeek: 0,
      averageTradesPerMonth: 0,
      maxTradesInDay: 0,
    };
  }

  const days = {};

  trades.forEach((trade) => {
    if (!trade.entry_date) return;

    const date = new Date(
      trade.entry_date
    );

    const key =
      date.toISOString().split("T")[0];

    days[key] =
      (days[key] || 0) + 1;
  });

  const tradingDays =
    Object.keys(days).length;

  const totalTrades =
    trades.length;

  const averageTradesPerDay =
    tradingDays > 0
      ? totalTrades / tradingDays
      : 0;

  const firstDate = new Date(
    Math.min(
      ...trades
        .filter((t) => t.entry_date)
        .map((t) =>
          new Date(t.entry_date).getTime()
        )
    )
  );

  const lastDate = new Date(
    Math.max(
      ...trades
        .filter((t) => t.entry_date)
        .map((t) =>
          new Date(t.entry_date).getTime()
        )
    )
  );

  const daysBetween =
    Math.max(
      1,
      Math.ceil(
        (lastDate - firstDate) /
          (1000 * 60 * 60 * 24)
      )
    );

  const weeksBetween =
    Math.max(
      1,
      daysBetween / 7
    );

  const monthsBetween =
    Math.max(
      1,
      daysBetween / 30.44
    );

  const maxTradesInDay =
    Math.max(
      ...Object.values(days)
    );

  return {
    tradingDays,

    averageTradesPerDay,

    averageTradesPerWeek:
      totalTrades / weeksBetween,

    averageTradesPerMonth:
      totalTrades / monthsBetween,

    maxTradesInDay,
  };
};



// ============================================
// PLAYBOOK PERFORMANCE
// ============================================

export const getPlaybookPerformance = (trades) => {

  const playbooks = {};

  trades.forEach((trade) => {

    const playbook =
      trade.playbook?.trim() || "Unknown";

    if (!playbooks[playbook]) {
      playbooks[playbook] = {
        playbook,

        trades: 0,
        winningTrades: 0,
        losingTrades: 0,

        netPnl: 0,

        grossProfit: 0,
        grossLoss: 0,

        totalR: 0,
        rTrades: 0,

        totalPlannedRR: 0,
        plannedRRTrades: 0,

        bestTrade: null,
        worstTrade: null,
      };
    }

    const stats = playbooks[playbook];

    const pnl = Number(
      trade.net_pnl || 0
    );

    stats.trades += 1;
    stats.netPnl += pnl;

    // -------------------------
    // WIN / LOSS
    // -------------------------

    if (pnl > 0) {

      stats.winningTrades += 1;
      stats.grossProfit += pnl;

    } else if (pnl < 0) {

      stats.losingTrades += 1;
      stats.grossLoss += Math.abs(pnl);

    }


    // -------------------------
    // REALIZED R
    // -------------------------

    const risk = Number(
      trade.sl || 0
    );

    if (risk > 0) {

      stats.totalR += pnl / risk;
      stats.rTrades += 1;

    }


    // -------------------------
    // PLANNED R:R
    // -------------------------

    const reward = Number(
      trade.tp || 0
    );

    if (risk > 0 && reward > 0) {

      stats.totalPlannedRR +=
        reward / risk;

      stats.plannedRRTrades += 1;

    }


    // -------------------------
    // BEST TRADE
    // -------------------------

    if (
      stats.bestTrade === null ||
      pnl > stats.bestTrade.pnl
    ) {

      stats.bestTrade = {
        pnl,
        tradeId: trade._id,
        date: trade.entry_date,
      };

    }


    // -------------------------
    // WORST TRADE
    // -------------------------

    if (
      stats.worstTrade === null ||
      pnl < stats.worstTrade.pnl
    ) {

      stats.worstTrade = {
        pnl,
        tradeId: trade._id,
        date: trade.entry_date,
      };

    }

  });


  // ============================================
  // CALCULATE DERIVED METRICS
  // ============================================

  return Object.values(playbooks)
    .map((stats) => {

      const winRate =
        stats.trades > 0
          ? (stats.winningTrades /
              stats.trades) *
            100
          : 0;


      const averagePnl =
        stats.trades > 0
          ? stats.netPnl /
            stats.trades
          : 0;


      const averageR =
        stats.rTrades > 0
          ? stats.totalR /
            stats.rTrades
          : 0;


      const plannedRR =
        stats.plannedRRTrades > 0
          ? stats.totalPlannedRR /
            stats.plannedRRTrades
          : 0;


      const profitFactor =
        stats.grossLoss > 0
          ? stats.grossProfit /
            stats.grossLoss
          : stats.grossProfit > 0
          ? Infinity
          : 0;


      const expectancy =
        averagePnl;


      return {
        ...stats,

        winRate,
        averagePnl,
        averageR,
        plannedRR,
        profitFactor,
        expectancy,
      };

    })
    .sort(
      (a, b) =>
        b.netPnl - a.netPnl
    );
};


// ============================================
// PLAYBOOK WIN RATE
// ============================================

export const getPlaybookWinRate = (trades) => {

  return getPlaybookPerformance(trades)
    .map((item) => ({
      playbook: item.playbook,
      winRate: item.winRate,
      trades: item.trades,
    }));
};


// ============================================
// PLAYBOOK R PERFORMANCE
// ============================================

export const getPlaybookRPerformance = (trades) => {

  return getPlaybookPerformance(trades)
    .map((item) => ({
      playbook: item.playbook,
      averageR: item.averageR,
      plannedRR: item.plannedRR,
    }));
};



// ============================================
// TRADE QUALITY ANALYSIS
// ============================================

export const getTradeQualityStats = (trades) => {

  const validTrades = trades.filter(
    (trade) => Number(trade.sl) > 0
  );

  if (!validTrades.length) {
    return {
      averageR: 0,
      averageWinR: 0,
      averageLossR: 0,
      bestR: 0,
      worstR: 0,
      averagePlannedRR: 0,
      positiveRTrades: 0,
      negativeRTrades: 0,
    };
  }


  let totalR = 0;
  let totalWinR = 0;
  let totalLossR = 0;

  let winRCount = 0;
  let lossRCount = 0;

  let totalPlannedRR = 0;
  let plannedRRCount = 0;

  let bestR = -Infinity;
  let worstR = Infinity;


  validTrades.forEach((trade) => {

    const pnl = Number(trade.net_pnl || 0);
    const risk = Number(trade.sl);

    const r = pnl / risk;

    totalR += r;


    // -------------------------
    // WIN / LOSS R
    // -------------------------

    if (r > 0) {

      totalWinR += r;
      winRCount++;

    } else if (r < 0) {

      totalLossR += r;
      lossRCount++;

    }


    // -------------------------
    // PLANNED R:R
    // -------------------------

    const reward = Number(trade.tp || 0);

    if (reward > 0) {

      totalPlannedRR += reward / risk;
      plannedRRCount++;

    }


    // -------------------------
    // BEST / WORST R
    // -------------------------

    bestR = Math.max(bestR, r);
    worstR = Math.min(worstR, r);

  });


  return {

    averageR:
      totalR / validTrades.length,

    averageWinR:
      winRCount > 0
        ? totalWinR / winRCount
        : 0,

    averageLossR:
      lossRCount > 0
        ? totalLossR / lossRCount
        : 0,

    bestR,

    worstR,

    averagePlannedRR:
      plannedRRCount > 0
        ? totalPlannedRR / plannedRRCount
        : 0,

    positiveRTrades: winRCount,

    negativeRTrades: lossRCount,

  };
};


// ============================================
// R DISTRIBUTION
// ============================================

export const getRDistribution = (trades) => {

  const validTrades = trades.filter(
    (trade) => Number(trade.sl) > 0
  );


  return validTrades.map((trade, index) => {

    const risk = Number(trade.sl);
    const pnl = Number(trade.net_pnl || 0);

    const r = pnl / risk;

    return {
      tradeNumber: index + 1,
      date: trade.entry_date,
      r,
      pnl,
      plannedR:
        Number(trade.tp || 0) / risk,
    };

  });

};





// ============================================
// DAY / HOUR P&L HEATMAP
// ============================================

export const getTimeHeatmapData = (trades) => {

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const hours = {};

  trades.forEach((trade) => {

    if (!trade.entry_date || !trade.entry_time) {
      return;
    }

    const date = new Date(trade.entry_date);

    const jsDay = date.getDay();

    const dayIndex =
      jsDay === 0
        ? 6
        : jsDay - 1;

    const hour = Number(
      trade.entry_time.split(":")[0]
    );

    if (Number.isNaN(hour)) {
      return;
    }

    if (!hours[hour]) {
      hours[hour] = {};
    }

    if (!hours[hour][days[dayIndex]]) {
      hours[hour][days[dayIndex]] = 0;
    }

    hours[hour][days[dayIndex]] += Number(
      trade.net_pnl || 0
    );

  });


  return Object.keys(hours)
    .map(Number)
    .sort((a, b) => a - b)
    .map((hour) => {

      const row = {
        hour,
        label: `${String(hour).padStart(2, "0")}:00`,
      };

      days.forEach((day) => {

        row[day] =
          hours[hour][day] || 0;

      });

      return row;

    });
};

