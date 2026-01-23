// Caminho: supabase/functions/enviar-notificacao/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // 1. Trata o CORS (Permite que seu site publicado converse com essa função)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Recebe os dados enviados pelo seu fvy.js
    const { items, destinatario, remetente_user } = await req.json();

    // 3. Monta as linhas da tabela HTML
    const tableRows = items.map((item: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #000;">${item.codigo || 'NOVO'}</td>
        <td style="padding: 8px; border: 1px solid #000;"><strong>${item.equipamento}</strong></td>
        <td style="padding: 8px; border: 1px solid #000;">${item.req_me || '-'}</td>
        <td style="padding: 8px; border: 1px solid #000;">${item.nf || '-'}</td>
        <td style="padding: 8px; border: 1px solid #000;">${item.qtd || '-'}</td>
        <td style="padding: 8px; border: 1px solid #000;">${item.setor}</td>
      </tr>
    `).join("");

    // 4. Monta o corpo do E-mail (Visual Azul Corporativo)
    const emailHtml = `
      <div style="font-family: Calibri, Arial, sans-serif; color: #333;">
        <h2 style="color: #000080;">FUP ALM - Notificação de Novos Ativos</h2>
        <p>Olá,</p>
        <p>O usuário <strong>${remetente_user || 'Usuário do Sistema'}</strong> registrou a entrada de novos ativos.</p>
        <p>Estes itens requerem inspeção ou cadastro do SGQ:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; border: 1px solid #000;">
          <thead>
            <tr style="background-color: #000080; color: white;">
              <th style="padding: 8px; border: 1px solid #000;">CÓDIGO</th>
              <th style="padding: 8px; border: 1px solid #000;">EQUIPAMENTO</th>
              <th style="padding: 8px; border: 1px solid #000;">REQ. ME</th>
              <th style="padding: 8px; border: 1px solid #000;">NF</th>
              <th style="padding: 8px; border: 1px solid #000;">QTD</th>
              <th style="padding: 8px; border: 1px solid #000;">SETOR</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          Mensagem automática do Sistema FUP.<br>
          Enviado em ${new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    `;

    // 5. Envia o E-mail via Resend
    const data = await resend.emails.send({
      from: "Notificação FUP <onboarding@resend.dev>", // Em produção, altere se tiver domínio próprio
      to: [destinatario], // Vai usar: 001827@conipaind.com.br
      subject: `Novo Ativo Cadastrado - ${items.length} item(s)`,
      html: emailHtml,
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});