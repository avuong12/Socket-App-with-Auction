function makeBid(event) {
  event.preventDefault();
  let inputBid = document.getElementById('bid');
  socket.emit('send_bid', inputBid.value);
  inputBid.value = '';
  return false;
}

function addBid(bid) {
  const bids = document.getElementById('auctions');
  const newBid = document.createElement('li');
  newBid.innerHTML = bid;
  bids.appendChild(newBid);
}

function setupAuctionSocketHandlers() {
  socket.on('send_bid', addBid);
}

function loadAuctionApp() {
  const bid = document.getElementById('bid-form');
  bid.onsubmit = makeBid;

  setupAuctionSocketHandlers();
}
