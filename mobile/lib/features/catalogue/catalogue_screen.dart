import 'package:flutter/material.dart';
import '../../data/auth.dart';
import '../../data/repository.dart';
import '../../models/models.dart';
import '../../theme.dart';
import '../../widgets/common.dart';
import '../onboarding/onboarding_screen.dart';

/// The pre-loaded open-data catalogue: governed sample datasets, each with a
/// confidentiality class. What a signed-in persona may request is gated by the
/// persona × classification access matrix.
class CatalogueScreen extends StatefulWidget {
  final AmaraverseRepository repo;
  const CatalogueScreen({super.key, required this.repo});

  @override
  State<CatalogueScreen> createState() => _CatalogueScreenState();
}

class _CatalogueScreenState extends State<CatalogueScreen> {
  Classification? _filter; // null = all

  void _request(BuildContext context, AuthController auth, Dataset ds) {
    if (!auth.isSignedIn) {
      Navigator.of(context).push(MaterialPageRoute(
          builder: (_) => OnboardingScreen(repo: widget.repo, requesting: ds)));
      return;
    }
    final access = widget.repo
        .personaByKey(auth.user!.personaKey)
        .accessFor(ds.classification);
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => _RequestSheet(ds: ds, access: access),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = AuthScope.of(context);
    final repo = widget.repo;
    final all = repo.datasets();
    final shown = _filter == null
        ? all
        : all.where((d) => d.classification == _filter).toList();

    return AnimatedBuilder(
      animation: auth,
      builder: (context, _) {
        final persona =
            auth.isSignedIn ? repo.personaByKey(auth.user!.personaKey) : null;
        return Scaffold(
          appBar: AppBar(
            titleSpacing: 20,
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Open Data Catalogue', style: AppTheme.display(20)),
                Text(
                    persona == null
                        ? 'Sign in to request · ${all.length} datasets'
                        : 'As ${persona.title} · ${all.length} datasets',
                    style:
                        const TextStyle(color: AppColors.muted2, fontSize: 11)),
              ],
            ),
            actions: [
              IconButton(
                tooltip: persona == null ? 'Sign in' : 'Account',
                icon: Icon(persona == null
                    ? Icons.login
                    : Icons.account_circle_outlined),
                onPressed: () => Navigator.of(context).push(MaterialPageRoute(
                    builder: (_) => OnboardingScreen(repo: repo))),
              ),
            ],
          ),
          body: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: SizedBox(
                  height: 52,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    children: [
                      _Chip(
                          label: 'All datasets',
                          on: _filter == null,
                          onTap: () => setState(() => _filter = null)),
                      ...Classification.values.map((c) => _Chip(
                          label: c.label,
                          color: c.color,
                          on: _filter == c,
                          onTap: () => setState(() => _filter = c))),
                    ],
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 6, 16, 24),
                sliver: SliverList.separated(
                  itemCount: shown.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (_, i) {
                    final d = shown[i];
                    final access = persona?.accessFor(d.classification);
                    return _DatasetCard(
                      ds: d,
                      access: access,
                      onRequest: () => _request(context, auth, d),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _Chip extends StatelessWidget {
  final String label;
  final bool on;
  final Color? color;
  final VoidCallback onTap;
  const _Chip(
      {required this.label, required this.on, required this.onTap, this.color});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 9, top: 8, bottom: 8),
      child: InkWell(
        borderRadius: BorderRadius.circular(24),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: on ? AppColors.gold : AppColors.surface,
            borderRadius: BorderRadius.circular(24),
            border: Border.fromBorderSide(
                BorderSide(color: on ? AppColors.gold : AppColors.line)),
          ),
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            if (color != null && !on) ...[
              Icon(Icons.circle, size: 7, color: color),
              const SizedBox(width: 7),
            ],
            Text(label,
                style: TextStyle(
                    color: on ? const Color(0xFF1A1205) : AppColors.muted,
                    fontWeight: on ? FontWeight.w600 : FontWeight.w400,
                    fontSize: 13)),
          ]),
        ),
      ),
    );
  }
}

class _DatasetCard extends StatelessWidget {
  final Dataset ds;
  final Access? access; // null when not signed in
  final VoidCallback onRequest;
  const _DatasetCard(
      {required this.ds, required this.access, required this.onRequest});

  @override
  Widget build(BuildContext context) {
    final closed = access == Access.closed;
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: const Border.fromBorderSide(BorderSide(color: AppColors.line)),
      ),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                  child: Text(ds.entity.toUpperCase(),
                      style: const TextStyle(
                          color: AppColors.muted2,
                          fontSize: 10,
                          letterSpacing: 1.0))),
              ClassBadge(ds.classification, dense: true),
            ],
          ),
          const SizedBox(height: 8),
          Text(ds.title,
              style: const TextStyle(
                  fontWeight: FontWeight.w600, fontSize: 16, height: 1.25)),
          const SizedBox(height: 6),
          Text(ds.description,
              style: const TextStyle(
                  color: AppColors.muted, fontSize: 13, height: 1.4)),
          const SizedBox(height: 12),
          Wrap(spacing: 6, runSpacing: 6, children: [
            _meta(ds.format),
            _meta('↻ ${ds.cadence}'),
            _meta(ds.owner),
          ]),
          const Divider(height: 26, color: AppColors.line),
          Align(
            alignment: Alignment.centerLeft,
            child: OutlinedButton.icon(
              onPressed: onRequest,
              style: OutlinedButton.styleFrom(
                foregroundColor: closed ? AppColors.muted : AppColors.text,
                side: BorderSide(
                    color: closed ? AppColors.muted2 : AppColors.line),
              ),
              icon: Icon(_icon(access), size: 16),
              label: Text(_label(access)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _meta(String s) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.04),
          borderRadius: BorderRadius.circular(16),
          border:
              const Border.fromBorderSide(BorderSide(color: AppColors.line)),
        ),
        child: Text(s,
            style: const TextStyle(color: AppColors.muted, fontSize: 11)),
      );

  IconData _icon(Access? a) => switch (a) {
        null => Icons.north_east,
        Access.instant => Icons.bolt,
        Access.agreement => Icons.edit_document,
        Access.closed => Icons.lock_outline,
      };

  String _label(Access? a) => switch (a) {
        null => 'Request access',
        Access.instant => 'Request · instant',
        Access.agreement => 'Request · agreement',
        Access.closed => 'Closed for you',
      };
}

class _RequestSheet extends StatelessWidget {
  final Dataset ds;
  final Access access;
  const _RequestSheet({required this.ds, required this.access});

  @override
  Widget build(BuildContext context) {
    final (color, head, body) = switch (access) {
      Access.instant => (
          const Color(0xFF5AD17A),
          'Instant access',
          'Your persona may use this tier directly. An API key & download link are issued on submit.'
        ),
      Access.agreement => (
          AppColors.gold,
          'Access on agreement',
          'This tier needs a short purpose review and a data-sharing agreement. We’ll route your request to the data steward.'
        ),
      Access.closed => (
          const Color(0xFFFF7A7A),
          'Closed tier',
          'This dataset is confidential and not available to your persona. You can request a steward review, but approval is unlikely.'
        ),
    };
    return Padding(
      padding: EdgeInsets.fromLTRB(
          22, 22, 22, 22 + MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Expanded(child: Text(ds.title, style: AppTheme.display(20))),
            ClassBadge(ds.classification, dense: true),
          ]),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(12),
              border: Border.fromBorderSide(BorderSide(color: color)),
            ),
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(head,
                  style: TextStyle(color: color, fontWeight: FontWeight.w700)),
              const SizedBox(height: 4),
              Text(body,
                  style: const TextStyle(
                      color: AppColors.muted, fontSize: 13, height: 1.4)),
            ]),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text(
                        'Request for “${ds.title}” logged with an audit reference.')));
              },
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.saffron,
                foregroundColor: const Color(0xFF1A1205),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              child: const Text('Submit request'),
            ),
          ),
        ],
      ),
    );
  }
}
