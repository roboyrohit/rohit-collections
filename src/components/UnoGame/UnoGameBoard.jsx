import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import Peer from 'peerjs';
import styles from './UnoGameBoard.module.scss';
import { Card } from 'primereact/card';

// --- Helpers ---
const generateShortId = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateDeck = () => {
    const colors = ['red', 'blue', 'green', 'yellow'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', '+2'];
    let deck = [];
    colors.forEach(c => values.forEach(v => deck.push({ color: c, value: v, id: Math.random() })));
    for (let i = 0; i < 4; i++) {
        deck.push({ color: 'wild', value: 'Wild', id: Math.random() });
        deck.push({ color: 'wild', value: '+4', id: Math.random() });
    }
    return deck.sort(() => Math.random() - 0.5);
};

// --- Sub-Component for 3D Cards ---
const UnoCard = ({ card, isFlipped, onClick, disabled, size = "normal" }) => {
    // Helper to format the symbol (e.g., shorter text for corner)
    const getSymbol = (val) => {
        if (val === 'Reverse') return '⇄';
        if (val === 'Skip') return '⊘';
        if (val === 'Wild') return 'W';
        return val;
    };

    return (
        <div
            className={`${styles.unoCard} ${isFlipped ? styles.isFlipped : ''} ${disabled ? styles.disabled : ''}`}
            onClick={onClick}
            style={size === "small" ? { transform: 'scale(0.6)' } : {}}
        >
            {/* FRONT SIDE */}
            <div className={`${styles.cardFront} ${styles[card.color]}`}>
                {/* Top Left Corner */}
                <div className={`${styles.cornerSymbol} ${styles.topLeft}`}>
                    {getSymbol(card?.value)}
                </div>

                {/* Main Center Value */}
                <span className={styles.valueText}>{getSymbol(card?.value)}</span>

                {/* Bottom Right Corner */}
                <div className={`${styles.cornerSymbol} ${styles.bottomRight}`}>
                    {getSymbol(card?.value)}
                </div>
            </div>

            {/* BACK SIDE */}
            <div className={styles.cardBack}>
                <div className={styles.inner}>UNO</div>
            </div>
        </div>
    );
};

export default function UnoGameBoard() {
    const [peerId, setPeerId] = useState('');
    const [remoteId, setRemoteId] = useState('');
    const [userName, setUserName] = useState('');
    const [remoteUserName, setRemoteUserName] = useState('');
    const [connections, setConnections] = useState([]); // Array of connections for multiple guests
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState({
        deck: [], discardPile: [], currentPlayerId: null, currentPlayerIdx: 0,
        gameStarted: false, direction: 1, activeColor: null
    });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [pendingWild, setPendingWild] = useState(null);
    const [winner, setWinner] = useState(null);
    const [isHost, setIsHost] = useState(null); // null = deciding, true = host, false = guest
    const [joinedMembers, setJoinedMembers] = useState([]); // Track joined members for host
    const [numCards, setNumCards] = useState(7); // Number of cards to start with
    const [isWaitingForGame, setIsWaitingForGame] = useState(false); // Guest waiting for game to start
    const peerRef = useRef(null);

    useEffect(() => {
        const shortId = generateShortId();
        const peer = new Peer(shortId);

        peer.on('open', id => setPeerId(id));
        peer.on('connection', conn => {
            // Add new connection to array (host receiving guest connection)
            setConnections(prev => [...prev, conn]);
            // Host receives MEMBER_JOINED and SYNC messages from guests
            conn.on('data', data => {
                if (data.type === 'MEMBER_JOINED') {
                    setJoinedMembers(prev => [...prev, { id: data.memberId, name: data.memberName }]);
                } else if (data.type === 'MEMBER_LEFT') {
                    setJoinedMembers(prev => prev.filter(m => m.id !== data.memberId));
                    setPlayers(prev => prev.filter(p => p.id !== data.memberId));
                } else if (data.type === 'SYNC' && data.fromGuest) {
                    // Only process SYNC from guests, not from host broadcasts
                    setPlayers(data.players);
                    setGameState(data.gameState);
                    // Host rebroadcasts to ALL connected guests (including the sender)
                    connections.forEach(c => {
                        c.send({ type: 'SYNC', gameState: data.gameState, players: data.players, fromGuest: false });
                    });
                }
            });
        });
        peer.on('error', () => window.location.reload());
        peerRef.current = peer;
        
        // Cleanup on unmount
        return () => {
            peer.destroy();
        };
    }, []);

    const setupListener = (conn) => {
        // Used by guests to listen to host responses
        conn.on('data', data => {
            if (data.type === 'SYNC') {
                // Guest receives SYNC from host
                console.log('Guest received SYNC:', { currentPlayerId: data.gameState.currentPlayerId, myId: peerId, players: data.players.map(p => ({ id: p.id, name: p.name })) });
                setPlayers(data.players);
                setGameState(data.gameState);
            }
        });
    };

    const joinGame = () => {
        if (!remoteId.trim()) {
            alert('Please enter friend\'s room code');
            return;
        }
        if (!remoteUserName.trim()) {
            alert('Please enter your name');
            return;
        }
        console.log('Guest joining with peerId:', peerId, 'remoteId:', remoteId);
        const conn = peerRef.current.connect(remoteId);
        setConnections([conn]);
        setupListener(conn);
        setPlayers([{ id: remoteId, name: "Host", hand: [] }, { id: peerId, name: remoteUserName, hand: [] }]);
        setIsWaitingForGame(true); // Set waiting state

        // Notify host that a member has joined
        conn.on('open', () => {
            console.log('Guest connection opened, sending MEMBER_JOINED with memberId:', peerId);
            conn.send({
                type: 'MEMBER_JOINED',
                memberName: remoteUserName,
                memberId: peerId
            });
        });
    };

    const leaveGame = () => {
        // Notify host that member is leaving
        if (connections[0]) {
            connections[0].send({
                type: 'MEMBER_LEFT',
                memberId: peerId,
                memberName: remoteUserName
            });
        }
        // Reset to home
        setIsHost(null);
        setIsWaitingForGame(false);
        setRemoteId('');
        setRemoteUserName('');
        setConnections([]);
        setPlayers([]);
    };

    const broadcast = (gState, pList) => {
        // Update local state
        console.log('Broadcasting:', { currentPlayerId: gState.currentPlayerId, players: pList.map(p => ({ id: p.id, name: p.name })) });
        setPlayers(pList);
        setGameState(gState);
        // Host sends to all connected guests
        connections.forEach(conn => {
            conn.send({ type: 'SYNC', gameState: gState, players: pList, fromGuest: false });
        });
    };

    const startGame = () => {
        if (!userName.trim()) {
            alert('Please enter your name');
            return;
        }
        if (joinedMembers.length === 0) {
            alert('Wait for at least 1 player to join');
            return;
        }
        const fullDeck = generateDeck();

        // Distribute cards to all players - ensure consistent order matching connection order
        const playerHands = [];
        playerHands.push({ id: peerId, name: userName, hand: fullDeck.splice(0, numCards) }); // Host

        // Add guests in connection order to ensure all clients have same order
        connections.forEach(conn => {
            const guest = joinedMembers.find(m => m.id === conn.peer);
            console.log('Matching guest:', { connPeer: conn.peer, joinedMembers: joinedMembers.map(m => ({ id: m.id, name: m.name })), found: guest });
            if (guest) {
                playerHands.push({
                    id: guest.id,
                    name: guest.name,
                    hand: fullDeck.splice(0, numCards)
                });
            }
        });

        console.log('Game starting with players:', playerHands.map(p => ({ id: p.id, name: p.name })));

        const initial = {
            deck: fullDeck,
            discardPile: [fullDeck.pop()],
            currentPlayerIdx: 0,
            currentPlayerId: playerHands[0].id,
            gameStarted: true,
            direction: 1,
            activeColor: null
        };

        broadcast(initial, playerHands);
    };

    const handleDraw = () => {
        // Only allow draw if this peer is the active player
        if (String(gameState.currentPlayerId) !== String(peerId)) return;
        const newDeck = [...gameState.deck];
        if (newDeck.length === 0) return;

        const card = newDeck.pop();
        const newPlayers = [...players];
        const myIdx = players.findIndex(p => p.id === peerId);
        newPlayers[myIdx].hand.push(card);

        // compute next index based on canonical players array
        const curIdx = players.findIndex(p => p.id === gameState.currentPlayerId);
        const nextIdx = (curIdx + gameState.direction + players.length) % players.length;
        const nextId = players[nextIdx].id;
        const newGameState = { ...gameState, deck: newDeck, currentPlayerIdx: nextIdx, currentPlayerId: nextId, activeColor: null };
        
        // Only host broadcasts to maintain canonical player order
        if (isHost) {
            broadcast(newGameState, newPlayers);
        } else {
            // Guest sends to host for rebroadcast
            connections[0]?.send({ type: 'SYNC', gameState: newGameState, players: newPlayers, fromGuest: true });
        }
    };

    const playCard = (idx) => {
        if (String(gameState.currentPlayerId) !== String(peerId)) {
            console.log('Not your turn. Current:', gameState.currentPlayerId, 'Your ID:', peerId, 'Players:', players.map(p => ({ id: p.id, name: p.name })));
            return;
        }
        const myIdx = players.findIndex(p => p.id === peerId);
        console.log('playCard debug:', { peerId, myIdx, playersIds: players.map(p => p.id), idx });
        if (myIdx === -1) {
            console.error('ERROR: Player not found in array!', { peerId, players: players.map(p => ({ id: p.id, name: p.name })) });
            return;
        }
        const card = players[myIdx].hand[idx];
        if (!card) {
            console.error('ERROR: Card is undefined!', { idx, handLength: players[myIdx].hand.length });
            return;
        }
        const top = gameState.discardPile[gameState.discardPile.length - 1];
        const validColor = gameState.activeColor || top.color;

        if (card.color === 'wild' || card.color === validColor || card.value === top.value) {
            if (card.color === 'wild') {
                setPendingWild({ idx, card });
                setShowColorPicker(true);
            } else {
                processMove(idx, card);
            }
        }
    };

    const processMove = (cardIdx, card, chosenColor = null) => {
        let newPlayers = [...players];
        let newDeck = [...gameState.deck];
        const myIdx = players.findIndex(p => p.id === peerId);

        newPlayers[myIdx].hand.splice(cardIdx, 1);

        let newDir = gameState.direction;
        if (card.value === 'Reverse') newDir *= -1;

        // compute current index from canonical currentPlayerId
        const curIdx = players.findIndex(p => p.id === gameState.currentPlayerId);
        let nextIdx = (curIdx + newDir + players.length) % players.length;

        if (card.value === '+2' || card.value === '+4') {
            const count = card.value === '+2' ? 2 : 4;
            for (let i = 0; i < count; i++) {
                if (newDeck.length > 0) newPlayers[nextIdx].hand.push(newDeck.pop());
            }
        }

        if (card.value === 'Skip' || card.value === '+2' || card.value === '+4') {
            nextIdx = (nextIdx + newDir + players.length) % players.length;
        }

        if (newPlayers[myIdx].hand.length === 0) setWinner(newPlayers[myIdx].name);

        const nextId = newPlayers[nextIdx].id;
        const newGameState = {
            ...gameState, deck: newDeck, discardPile: [...gameState.discardPile, card],
            currentPlayerIdx: nextIdx, currentPlayerId: nextId, direction: newDir, activeColor: chosenColor
        };
        
        // Only host broadcasts to maintain canonical player order
        if (isHost) {
            broadcast(newGameState, newPlayers);
        } else {
            // Guest sends to host for rebroadcast
            connections[0]?.send({ type: 'SYNC', gameState: newGameState, players: newPlayers, fromGuest: true });
        }
    };

    const isMyTurn = gameState.gameStarted && String(gameState.currentPlayerId) === String(peerId);
    const currentPlayerName = players.find(p => p.id === gameState.currentPlayerId)?.name || "Player";
    const myDisplayName = players.find(p => p.id === peerId)?.name || (isHost ? userName : remoteUserName);

    return (
        <Card
            unstyled="false"
            subTitle={<span className="pageTitle">Uno Game Board</span>}
        >
            <Card className="pageContent">
                <div className={styles.boardContainer}>
                    {!gameState.gameStarted ? (
                        <div className={styles.lobbyCard}>
                            <h2>UNO Game</h2>

                            {isHost === null ? (
                                // Step 1: Choose role
                                <div>
                                    <p>ARE YOU THE HOST?</p>
                                    <Button label="HOST GAME" severity="success" onClick={() => setIsHost(true)} className="w-full mb-2" />
                                    <Button label="JOIN GAME" onClick={() => setIsHost(false)} className="w-full" />
                                </div>
                            ) : isHost ? (
                                // Step 2: Host setup
                                <div>
                                    <p>YOUR ROOM CODE:</p>
                                    <div className={styles.roomCode}>{peerId}</div>

                                    <InputText
                                        value={userName}
                                        onChange={e => setUserName(e.target.value)}
                                        placeholder="ENTER YOUR NAME"
                                        className="w-full mb-3"
                                    />

                                    <InputText
                                        type="number"
                                        value={numCards}
                                        onChange={e => setNumCards(Math.max(1, parseInt(e.target.value) || 1))}
                                        placeholder="NUMBER OF CARDS TO START WITH"
                                        min="1"
                                        max="108"
                                        className="w-full mb-3"
                                    />

                                    {/* Display Joined Members */}
                                    {joinedMembers.length > 0 && (
                                        <div className={styles.membersSection}>
                                            <h3>JOINED MEMBERS:</h3>
                                            <ul className={styles.membersList}>
                                                {joinedMembers.map((member, idx) => (
                                                    <li key={idx}>
                                                        <span className={styles.memberDot}>●</span> {member.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <Button
                                        label="START GAME"
                                        severity="success"
                                        onClick={startGame}
                                        className="w-full"
                                        disabled={!userName.trim() || joinedMembers.length === 0}
                                    />
                                </div>
                            ) : (
                                // Step 3: Guest setup
                                <div>
                                    {!isWaitingForGame ? (
                                        <>
                                            <InputText
                                                value={remoteUserName}
                                                onChange={e => setRemoteUserName(e.target.value)}
                                                placeholder="ENTER YOUR NAME"
                                                className="w-full mb-3"
                                            />

                                            <InputText
                                                value={remoteId}
                                                onChange={e => setRemoteId(e.target.value)}
                                                placeholder="ENTER HOST'S ROOM CODE"
                                                className="w-full mb-3"
                                            />

                                            <Button label="JOIN ROOM" onClick={joinGame} className="w-full mb-2" />
                                            <Button label="BACK" onClick={() => setIsHost(null)} className="w-full" />
                                        </>
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                                                PLEASE WAIT UNTIL HOST STARTS THE GAME...
                                            </p>
                                            <p>You are connected as: <strong>{remoteUserName}</strong></p>
                                            <Button
                                                label="LEAVE GAME"
                                                severity="danger"
                                                onClick={leaveGame}
                                                className="w-full mt-3"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.gameBoard}>
                            <div className={styles.playingArea}>
                                <div className={styles.hintBar}>
                                    <div className={styles.turnIndicator}>
                                        <Button
                                            label={isMyTurn ? 'YOUR TURN' : `${currentPlayerName}'S TURN`}
                                            severity="info"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className={styles.exitDiv}>
                                        <Button
                                            label={`You: ${myDisplayName || '—'}`}
                                            severity="success"
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Leave Game Button */}
                                    <div className={styles.exitDiv}>
                                        <Button
                                            label="LEAVE GAME"
                                            severity="danger"
                                            onClick={leaveGame}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className={styles.deckArea}>
                                    <div onClick={handleDraw} style={{ cursor: 'pointer' }}>
                                        <UnoCard card={{ color: 'black' }} isFlipped={true} />
                                    </div>
                                    <UnoCard card={{
                                        ...gameState.discardPile[gameState.discardPile.length - 1],
                                        color: gameState.activeColor || gameState.discardPile[gameState.discardPile.length - 1].color
                                    }} isFlipped={false} />
                                </div>

                                <p>YOUR CARDS</p>
                                <div className={styles.playerHand}>
                                    {players.find(p => p.id === peerId)?.hand.map((c, i) => (
                                        <div key={i} className={styles.cardWrapper}>
                                            <UnoCard
                                                card={c}
                                                isFlipped={false}
                                                disabled={!isMyTurn}
                                                onClick={() => playCard(i)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Dialog header="CHOOSE A COLOR" visible={showColorPicker} closable={false} onHide={() => { }}>
                                    <div className={styles.colorPickerGrid}>
                                        {['red', 'blue', 'green', 'yellow'].map(c => (
                                            <button key={c} className={styles[c]} onClick={() => { setShowColorPicker(false); processMove(pendingWild.idx, pendingWild.card, c); }}>
                                                {c.toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </Dialog>
                            </div>
                            <div className={styles.playingArea}>
                                {/* Display all opponents */}
                                {players.filter(p => p.id !== peerId).map((opponent) => (
                                    <div key={opponent.id}>
                                        <p>{opponent.name}'S CARDS</p>
                                        <div className={styles.playerHand}>
                                            {opponent.hand.map((_, i) => (
                                                <div key={i} className={styles.cardWrapper}>
                                                    <UnoCard card={{ color: 'black' }} isFlipped={true} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <Dialog header="VICTORY!" visible={!!winner} onHide={() => window.location.reload()}>
                        <h2 style={{ textAlign: 'center' }}>{winner} WON!</h2>
                        <Button label="REMATCH" className="w-full" onClick={() => window.location.reload()} />
                    </Dialog>
                </div>
            </Card>
        </Card >
    );
};