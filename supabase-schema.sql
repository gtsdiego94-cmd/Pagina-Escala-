create table if not exists public.escala_edicoes (
  mes text not null check (mes in ('julho', 'agosto')),
  dia integer not null check (dia between 1 and 31),
  escala jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (mes, dia)
);

alter table public.escala_edicoes enable row level security;

drop policy if exists "Leitura publica das edicoes" on public.escala_edicoes;
create policy "Leitura publica das edicoes"
  on public.escala_edicoes for select
  using (true);

drop policy if exists "Administrador pode inserir edicoes" on public.escala_edicoes;
create policy "Administrador pode inserir edicoes"
  on public.escala_edicoes for insert
  to authenticated
  with check (true);

drop policy if exists "Administrador pode atualizar edicoes" on public.escala_edicoes;
create policy "Administrador pode atualizar edicoes"
  on public.escala_edicoes for update
  to authenticated
  using (true)
  with check (true);

grant select on public.escala_edicoes to anon, authenticated;
grant insert, update on public.escala_edicoes to authenticated;

alter table public.escala_edicoes
  drop constraint if exists escala_edicoes_mes_check;

alter table public.escala_edicoes
  add constraint escala_edicoes_mes_check
  check (mes in ('julho', 'agosto', 'setembro'));