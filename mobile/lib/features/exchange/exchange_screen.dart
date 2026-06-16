import 'package:flutter/material.dart';
import '../../data/auth.dart';
import '../../data/repository.dart';
import '../../models/models.dart';
import '../../theme.dart';
import '../../widgets/common.dart';
import '../onboarding/onboarding_screen.dart';

/// The CRDA-governed Data Exchange Hub: government entities exchange data under
/// data-sharing agreements, with CRDA as the governing authority.
class ExchangeScreen extends StatelessWidget {
  final AmaraverseRepository repo;
  const ExchangeScreen({super.key, required this.repo});

  void _propose(BuildContext context) {
    final auth = AuthScope.of(context);
    if (!auth.isSignedIn) {
      Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => OnboardingScreen(repo: repo)));
      return;
    }
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) =>
          _ProposeSheet(repo: repo, personaKey: auth.user!.personaKey),
    );
  }

  @override
  Widget build(BuildContext context) {
    final entities = repo.exchangeEntities();
    final flow = repo.exchangeFlow();
    final register = repo.exchanges();
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 20,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Data Exchange Hub', style: AppTheme.display(20)),
            const Text('Governed by CRDA',
                style: TextStyle(color: AppColors.gold, fontSize: 11)),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        children: [
          const Text(
            'Government-to-government data, exchanged under governance. Every entity requests and provides data here, with CRDA classifying it, approving restricted exchanges, holding the register of agreements and auditing every transaction.',
            style: TextStyle(color: AppColors.muted, height: 1.5),
          ),
          const SizedBox(height: 24),

          // workflow
          const SectionHeader(
              kicker: 'The governed workflow', title: 'Request to provision'),
          const SizedBox(height: 14),
          ...flow.map((s) => _StepRow(step: s)),

          const SizedBox(height: 26),
          // entities
          const SectionHeader(
              kicker: 'Participating entities', title: 'Providers & consumers'),
          const SizedBox(height: 14),
          ...entities.map((e) => _EntityRow(entity: e)),

          const SizedBox(height: 26),
          // register
          const SectionHeader(
              kicker: 'The exchange register',
              title: 'Live inter-agency agreements'),
          const SizedBox(height: 14),
          ...register.map((x) => _RecordCard(record: x)),

          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: FilledButton.icon(
              onPressed: () => _propose(context),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.saffron,
                foregroundColor: const Color(0xFF1A1205),
                padding: const EdgeInsets.symmetric(vertical: 15),
              ),
              icon: const Icon(Icons.swap_horiz, size: 18),
              label: const Text('Propose an exchange'),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'data.amaravati is a concept — exchange agreements shown are illustrative.',
            style:
                TextStyle(color: AppColors.muted2, fontSize: 11, height: 1.6),
          ),
        ],
      ),
    );
  }
}

class _StepRow extends StatelessWidget {
  final ExchangeStep step;
  const _StepRow({required this.step});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.fromBorderSide(
              BorderSide(color: step.crda ? AppColors.gold : AppColors.line)),
        ),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(step.number, style: AppTheme.display(22, color: AppColors.gold)),
          const SizedBox(width: 16),
          Expanded(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Text(step.title,
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, fontSize: 15)),
                if (step.crda) ...[
                  const SizedBox(width: 8),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10),
                      border: const Border.fromBorderSide(
                          BorderSide(color: AppColors.gold)),
                    ),
                    child: const Text('CRDA',
                        style: TextStyle(
                            color: AppColors.gold,
                            fontSize: 8,
                            letterSpacing: 1.2)),
                  ),
                ],
              ]),
              const SizedBox(height: 4),
              Text(step.description,
                  style: const TextStyle(
                      color: AppColors.muted, fontSize: 12.5, height: 1.4)),
            ]),
          ),
        ]),
      ),
    );
  }
}

class _EntityRow extends StatelessWidget {
  final GovEntity entity;
  const _EntityRow({required this.entity});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.fromBorderSide(BorderSide(
              color: entity.governs ? AppColors.gold : AppColors.line)),
        ),
        child: Row(children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.surfaceHi,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(entity.icon, color: entity.color, size: 20),
          ),
          const SizedBox(width: 14),
          Expanded(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Flexible(
                    child: Text(entity.abbr,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, fontSize: 14))),
                if (entity.governs) ...[
                  const SizedBox(width: 8),
                  const Text('GOVERNS',
                      style: TextStyle(
                          color: AppColors.gold,
                          fontSize: 8,
                          letterSpacing: 1.2)),
                ],
              ]),
              const SizedBox(height: 2),
              Text(entity.role,
                  style:
                      const TextStyle(color: AppColors.muted2, fontSize: 11)),
            ]),
          ),
          _stat('${entity.published}', 'pub'),
          const SizedBox(width: 14),
          _stat('${entity.consumed}', 'con'),
        ]),
      ),
    );
  }

  Widget _stat(String v, String l) => Column(children: [
        Text(v, style: AppTheme.display(16)),
        Text(l, style: const TextStyle(color: AppColors.muted2, fontSize: 9)),
      ]);
}

class _RecordCard extends StatelessWidget {
  final ExchangeRecord record;
  const _RecordCard({required this.record});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border:
              const Border.fromBorderSide(BorderSide(color: AppColors.line)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              Expanded(
                child: Text.rich(
                    TextSpan(children: [
                      TextSpan(
                          text: record.provider,
                          style: const TextStyle(fontWeight: FontWeight.w600)),
                      const TextSpan(
                          text: '  →  ',
                          style: TextStyle(color: AppColors.gold)),
                      TextSpan(
                          text: record.consumer,
                          style: const TextStyle(fontWeight: FontWeight.w600)),
                    ]),
                    style: const TextStyle(fontSize: 14)),
              ),
              _statusBadge(record.status),
            ]),
            const SizedBox(height: 8),
            Text(record.dataset,
                style: const TextStyle(color: AppColors.text, fontSize: 13)),
            const SizedBox(height: 8),
            Row(children: [
              ClassBadge(record.classification, dense: true),
              const SizedBox(width: 10),
              Expanded(
                child: Text(record.purpose,
                    style:
                        const TextStyle(color: AppColors.muted, fontSize: 12)),
              ),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _statusBadge(ExchangeStatus s) {
    final c = s.color;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.fromBorderSide(BorderSide(color: c)),
      ),
      child: Row(mainAxisSize: MainAxisSize.min, children: [
        Icon(Icons.circle, size: 6, color: c),
        const SizedBox(width: 6),
        Text(s.label.toUpperCase(),
            style: TextStyle(
                color: c,
                fontSize: 9,
                letterSpacing: 0.6,
                fontWeight: FontWeight.w600)),
      ]),
    );
  }
}

class _ProposeSheet extends StatefulWidget {
  final AmaraverseRepository repo;
  final String personaKey;
  const _ProposeSheet({required this.repo, required this.personaKey});
  @override
  State<_ProposeSheet> createState() => _ProposeSheetState();
}

class _ProposeSheetState extends State<_ProposeSheet> {
  late String _provider;
  late Dataset _dataset;

  @override
  void initState() {
    super.initState();
    _provider =
        widget.repo.exchangeEntities().firstWhere((e) => !e.governs).name;
    _dataset = widget.repo.datasets().first;
  }

  @override
  Widget build(BuildContext context) {
    final govt = ['agency', 'partner', 'steward'].contains(widget.personaKey);
    final providers =
        widget.repo.exchangeEntities().where((e) => !e.governs).toList();
    final cls = _dataset.classification;
    final routing = cls == Classification.public
        ? 'Open exchange — registered and logged, no agreement needed.'
        : cls == Classification.confidential
            ? 'Confidential — CRDA approval is unlikely; strictly need-to-know.'
            : 'Routed to CRDA for a time-boxed data-sharing agreement.';
    return Padding(
      padding: EdgeInsets.fromLTRB(
          20, 20, 20, 20 + MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Propose a data exchange', style: AppTheme.display(20)),
          const SizedBox(height: 6),
          const Text(
              'Request data from another government entity. CRDA reviews before any exchange begins.',
              style: TextStyle(color: AppColors.muted, fontSize: 13)),
          const SizedBox(height: 16),
          if (!govt)
            Container(
              margin: const EdgeInsets.only(bottom: 14),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.gold.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(10),
                border: const Border.fromBorderSide(
                    BorderSide(color: AppColors.line)),
              ),
              child: const Text(
                  'Exchanges run between government entities. A Government Agency, Infrastructure Partner or Data Steward persona is needed to submit.',
                  style: TextStyle(color: AppColors.gold, fontSize: 11.5)),
            ),
          _label('Provider entity'),
          DropdownButtonFormField<String>(
            initialValue: _provider,
            isExpanded: true,
            dropdownColor: AppColors.surfaceHi,
            decoration: _dec(),
            items: providers
                .map(
                    (e) => DropdownMenuItem(value: e.name, child: Text(e.name)))
                .toList(),
            onChanged: (v) => setState(() => _provider = v!),
          ),
          const SizedBox(height: 12),
          _label('Dataset requested'),
          DropdownButtonFormField<String>(
            initialValue: _dataset.title,
            isExpanded: true,
            dropdownColor: AppColors.surfaceHi,
            decoration: _dec(),
            items: widget.repo
                .datasets()
                .map((d) => DropdownMenuItem(
                    value: d.title,
                    child: Text(d.title, overflow: TextOverflow.ellipsis)))
                .toList(),
            onChanged: (v) => setState(() => _dataset =
                widget.repo.datasets().firstWhere((d) => d.title == v)),
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: cls.color.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(10),
              border: Border.fromBorderSide(BorderSide(color: cls.color)),
            ),
            child: Row(children: [
              ClassBadge(cls, dense: true),
              const SizedBox(width: 10),
              Expanded(
                  child: Text(routing,
                      style: const TextStyle(
                          color: AppColors.muted, fontSize: 12, height: 1.4))),
            ]),
          ),
          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: () {
                Navigator.of(context).pop();
                final ref =
                    'DX-AP-${(DateTime.now().millisecondsSinceEpoch % 100000).toString().padLeft(5, '0')}';
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content:
                        Text('Submitted to CRDA review · reference $ref')));
              },
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.saffron,
                foregroundColor: const Color(0xFF1A1205),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              child: const Text('Submit to CRDA review'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _label(String s) => Padding(
        padding: const EdgeInsets.only(bottom: 7),
        child: Text(s.toUpperCase(),
            style: const TextStyle(
                color: AppColors.muted, fontSize: 11, letterSpacing: 0.6)),
      );

  InputDecoration _dec() => const InputDecoration(
        filled: true,
        fillColor: AppColors.surfaceHi,
        contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        border: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(11)),
            borderSide: BorderSide(color: AppColors.line)),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.all(Radius.circular(11)),
            borderSide: BorderSide(color: AppColors.line)),
      );
}
