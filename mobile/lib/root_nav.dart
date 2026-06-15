import 'package:flutter/material.dart';
import 'data/repository.dart';
import 'theme.dart';
import 'features/home/home_screen.dart';
import 'features/twin/twin_screen.dart';
import 'features/connectors/connectors_screen.dart';
import 'features/catalogue/catalogue_screen.dart';
import 'features/cities/cities_screen.dart';
import 'features/profile/profile_screen.dart';

/// App shell with bottom navigation. Screens are built lazily and kept alive
/// via IndexedStack so the WebView twin doesn't reload on every tab switch.
class RootNav extends StatefulWidget {
  final AmaraverseRepository repo;
  const RootNav({super.key, required this.repo});

  @override
  State<RootNav> createState() => _RootNavState();
}

class _RootNavState extends State<RootNav> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final repo = widget.repo;
    final screens = [
      HomeScreen(repo: repo),
      CatalogueScreen(repo: repo),
      ConnectorsScreen(repo: repo),
      TwinScreen(repo: repo),
      CitiesScreen(repo: repo),
      ProfileScreen(repo: repo),
    ];

    return Scaffold(
      extendBody: true,
      body: IndexedStack(index: _index, children: screens),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.line)),
        ),
        child: NavigationBar(
          backgroundColor: AppColors.bg2,
          indicatorColor: AppColors.saffron.withValues(alpha: 0.18),
          selectedIndex: _index,
          onDestinationSelected: (i) => setState(() => _index = i),
          destinations: const [
            NavigationDestination(
                icon: Icon(Icons.dashboard_outlined),
                selectedIcon: Icon(Icons.dashboard),
                label: 'Home'),
            NavigationDestination(
                icon: Icon(Icons.dataset_outlined),
                selectedIcon: Icon(Icons.dataset),
                label: 'Catalogue'),
            NavigationDestination(
                icon: Icon(Icons.hub_outlined),
                selectedIcon: Icon(Icons.hub),
                label: 'Connectors'),
            NavigationDestination(
                icon: Icon(Icons.view_in_ar_outlined),
                selectedIcon: Icon(Icons.view_in_ar),
                label: 'Twin'),
            NavigationDestination(
                icon: Icon(Icons.location_city_outlined),
                selectedIcon: Icon(Icons.location_city),
                label: 'Cities'),
            NavigationDestination(
                icon: Icon(Icons.person_outline),
                selectedIcon: Icon(Icons.person),
                label: 'You'),
          ],
        ),
      ),
    );
  }
}
