function Transaction(date, from_user, to_user, reason, amount) {
    this.date = date;
    this.from = from_user;
    this.to = to_user;
    this.reason = reason;
    this.amount = amount;
}

module.exports = Transaction;