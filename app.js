class RockPaperScissorsGame {
    constructor() {
        this.wallet = null;
        this.connection = new solanaWeb3.Connection('https://api.devnet.solana.com');
        this.selectedMove = null;
        this.selectedBet = 0.1;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkTosAcceptance();
    }

    checkTosAcceptance() {
        const tosAccepted = localStorage.getItem('tosAccepted');
        if (!tosAccepted) {
            document.getElementById('tosModal').style.display = 'block';
        } else {
            document.getElementById('tosModal').style.display = 'none';
        }
    }

    setupEventListeners() {
        // Wallet connection
        document.getElementById('connectWallet').addEventListener('click', () => this.connectWallet());
        document.getElementById('depositBtn').addEventListener('click', () => this.openDepositModal());
        document.getElementById('withdrawBtn').addEventListener('click', () => this.openWithdrawModal());
        
        // Modal controls
        document.getElementById('cancelDeposit').addEventListener('click', () => this.closeDepositModal());
        document.getElementById('cancelWithdraw').addEventListener('click', () => this.closeWithdrawModal());
        document.getElementById('confirmDeposit').addEventListener('click', () => this.confirmDeposit());
        document.getElementById('confirmWithdraw').addEventListener('click', () => this.confirmWithdraw());
        
        // Quick amount buttons
        document.querySelectorAll('.quick-amount').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = e.target.dataset.amount;
                const modal = e.target.closest('.modal');
                const input = modal.querySelector('.amount-input');
                input.value = amount;
            });
        });
        
        // TOS buttons
        document.getElementById('acceptTos').addEventListener('click', () => {
            localStorage.setItem('tosAccepted', 'true');
            document.getElementById('tosModal').style.display = 'none';
            this.showNotification('✅ Welcome! You can now use the platform.');
        });
        
        // Bet presets
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectBetAmount(e.target.dataset.amount));
        });
        
        // Bet input
        document.getElementById('customBet').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (value < 0.1) {
                e.target.value = 0.1;
                this.selectedBet = 0.1;
                this.showNotification('Minimum bet is 0.1 SOL', 'error');
            } else {
                this.selectedBet = value;
            }
        });
        
        // Move selection
        document.querySelectorAll('.weapon').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectMove(e.currentTarget.dataset.weapon);
            });
        });
        
        // Game actions
        document.getElementById('createGame').addEventListener('click', () => {
            if (!localStorage.getItem('tosAccepted')) {
                this.showNotification('Please accept Terms of Service first', 'error');
                return;
            }
            this.createGame();
        });
    }

    async connectWallet() {
        try {
            if (!window.solana) {
                this.showNotification('Please install Phantom wallet', 'error');
                window.open('https://phantom.app/', '_blank');
                return;
            }

            const response = await window.solana.connect();
            this.wallet = {
                address: response.publicKey.toString(),
                publicKey: response.publicKey
            };

            document.getElementById('connectWallet').classList.add('hidden');
            document.getElementById('walletInfo').classList.remove('hidden');
            document.getElementById('walletAddress').textContent = this.formatAddress(this.wallet.address);
            
            this.updateBalance();
            this.updateDepositBalance();
            this.showNotification('✅ Wallet connected successfully!');
        } catch (error) {
            this.showNotification('❌ Failed to connect wallet', 'error');
        }
    }

    async updateBalance() {
        try {
            const balance = await this.connection.getBalance(this.wallet.publicKey);
            const balanceSOL = balance / solanaWeb3.LAMPORTS_PER_SOL;
            document.getElementById('walletBalance').textContent = `${balanceSOL.toFixed(4)} SOL`;
            
            // Also update deposited balance
            this.updateDepositBalance();
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    }

    updateDepositBalance() {
        if (this.wallet) {
            const depositedBalance = parseFloat(localStorage.getItem(`balance_${this.wallet.address}`) || '0');
            document.getElementById('walletBalance').textContent = `${depositedBalance.toFixed(4)} SOL (Deposited)`;
        }
    }

    selectBetAmount(amount) {
        this.selectedBet = parseFloat(amount);
        document.getElementById('customBet').value = amount;
        
        document.querySelectorAll('.bet-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        this.showNotification(`Bet set to ${amount} SOL`);
    }

    selectMove(move) {
        this.selectedMove = move;
        
        document.querySelectorAll('.weapon').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');
        
        document.getElementById('createGame').disabled = false;
        this.showNotification(`Selected: ${move}`);
    }

    createGame() {
        if (!this.wallet) {
            this.showNotification('Please connect your wallet first', 'error');
            return;
        }
        
        if (!this.selectedMove) {
            this.showNotification('Please select your move first', 'error');
            return;
        }

        // Check if user has enough deposited balance
        const depositedBalance = parseFloat(localStorage.getItem(`balance_${this.wallet.address}`) || '0');
        
        if (depositedBalance < this.selectedBet) {
            this.showNotification(`Insufficient balance! You need ${this.selectedBet} SOL. Please deposit first.`, 'error');
            return;
        }

        // Deduct bet amount from deposited balance
        const newBalance = depositedBalance - this.selectedBet;
        localStorage.setItem(`balance_${this.wallet.address}`, newBalance.toString());
        
        // Update display
        this.updateDepositBalance();
        
        // Create game
        const gameId = Date.now().toString();
        this.showNotification(`✅ Game created! Bet: ${this.selectedBet} SOL, Move: ${this.selectedMove}`);
        
        // Reset selections
        document.querySelectorAll('.weapon').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.bet-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('customBet').value = '';
        document.getElementById('createGame').disabled = true;
        this.selectedMove = null;
        this.selectedBet = 0.1;
    }

    openDepositModal() {
        if (!localStorage.getItem('tosAccepted')) {
            this.showNotification('Please accept Terms of Service first', 'error');
            return;
        }
        if (!this.wallet) {
            this.showNotification('Connect wallet first', 'error');
            return;
        }
        document.getElementById('depositModal').style.display = 'block';
    }

    closeDepositModal() {
        document.getElementById('depositModal').style.display = 'none';
        document.getElementById('depositAmount').value = '';
    }

    openWithdrawModal() {
        if (!this.wallet) {
            this.showNotification('Connect wallet first', 'error');
            return;
        }
        document.getElementById('withdrawModal').style.display = 'block';
    }

    closeWithdrawModal() {
        document.getElementById('withdrawModal').style.display = 'none';
        document.getElementById('withdrawAmount').value = '';
    }

    async confirmDeposit() {
        const amount = document.getElementById('depositAmount').value;
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }

        try {
            const transaction = new solanaWeb3.Transaction().add(
                solanaWeb3.SystemProgram.transfer({
                    fromPubkey: this.wallet.publicKey,
                    toPubkey: new solanaWeb3.PublicKey('DTefryosG5UabebPwfVaPMNrQpx34K7c6Fb31wmhiBu6'),
                    lamports: parseFloat(amount) * solanaWeb3.LAMPORTS_PER_SOL
                })
            );

            transaction.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash;
            transaction.feePayer = this.wallet.publicKey;

            const signed = await window.solana.signTransaction(transaction);
            const signature = await this.connection.sendRawTransaction(signed.serialize());
            
            // Add to deposited balance
            const currentDeposit = parseFloat(localStorage.getItem(`balance_${this.wallet.address}`) || '0');
            const newDeposit = currentDeposit + parseFloat(amount);
            localStorage.setItem(`balance_${this.wallet.address}`, newDeposit.toString());
            
            this.showNotification(`✅ Deposited ${amount} SOL successfully!`);
            this.closeDepositModal();
            this.updateDepositBalance();
            setTimeout(() => this.updateBalance(), 2000);
        } catch (error) {
            this.showNotification('❌ Deposit failed: ' + error.message, 'error');
        }
    }

    async confirmWithdraw() {
        const amount = document.getElementById('withdrawAmount').value;
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }

        this.showNotification('Withdraw functionality coming soon!');
        this.closeWithdrawModal();
    }

    formatAddress(address) {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#ff4444' : '#4CAF50'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            font-weight: bold;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

window.game = new RockPaperScissorsGame();


// Snow effect
const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const snowflakes = [];
for (let i = 0; i < 100; i++) {
    snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        drift: Math.random() * 0.5 - 0.25
    });
}

function animateSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();
        
        flake.y += flake.speed;
        flake.x += flake.drift;
        
        if (flake.y > canvas.height) {
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
        }
    });
    
    requestAnimationFrame(animateSnow);
}

animateSnow();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
