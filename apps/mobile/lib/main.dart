import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

void main() {
  runApp(const BcgsApp());
}

class BcgsApp extends StatelessWidget {
  const BcgsApp({super.key});

  @override
  Widget build(BuildContext context) {
    final router = GoRouter(routes: [
      GoRoute(path: '/', builder: (context, state) => const LobbyScreen()),
      GoRoute(path: '/wallet', builder: (context, state) => const WalletScreen()),
      GoRoute(path: '/game/:id', builder: (context, state) => GameScreen(gameId: state.pathParameters['id'] ?? 'chess')),
    ]);

    return MaterialApp.router(
      title: 'BCGS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff2dd4bf)),
        useMaterial3: true,
      ),
      routerConfig: router,
    );
  }
}

class LobbyScreen extends StatelessWidget {
  const LobbyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final games = ['Chess', 'Ludo', 'Tash'];
    return Scaffold(
      appBar: AppBar(title: const Text('BCGS Lobby'), actions: [
        IconButton(onPressed: () => context.go('/wallet'), icon: const Icon(Icons.account_balance_wallet)),
      ]),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: games.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final game = games[index];
          return Card(
            child: ListTile(
              title: Text(game),
              subtitle: const Text('Realtime matchmaking'),
              trailing: const Icon(Icons.play_arrow),
              onTap: () => context.go('/game/${game.toLowerCase()}'),
            ),
          );
        },
      ),
    );
  }
}

class GameScreen extends StatelessWidget {
  const GameScreen({super.key, required this.gameId});

  final String gameId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('$gameId room')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: GridView.count(
                crossAxisCount: 8,
                children: List.generate(64, (index) {
                  final dark = ((index ~/ 8) + index).isEven;
                  return Container(color: dark ? Colors.teal.shade100 : Colors.grey.shade200);
                }),
              ),
            ),
            const SizedBox(height: 16),
            FilledButton(onPressed: () {}, child: const Text('Send Move')),
          ],
        ),
      ),
    );
  }
}

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Wallet')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(child: ListTile(title: Text('CORE'), subtitle: Text('0.00 available'))),
          Card(child: ListTile(title: Text('BCGS'), subtitle: Text('0.00 available'))),
        ],
      ),
    );
  }
}
