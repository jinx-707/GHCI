/**
 * Currency utilities for Indian Rupees
 */

export const formatRupees = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  
  const num = parseFloat(amount);
  
  if (num >= 10000000) { // 1 crore
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  } else if (num >= 100000) { // 1 lakh
    return `₹${(num / 100000).toFixed(1)}L`;
  } else if (num >= 1000) { // thousands
    return `₹${(num / 1000).toFixed(1)}K`;
  } else {
    return `₹${num.toLocaleString('en-IN')}`;
  }
};

export const formatRupeesDetailed = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
};

export const parseRupees = (rupeesString) => {
  if (!rupeesString) return 0;
  return parseFloat(rupeesString.replace(/[₹,]/g, ''));
};