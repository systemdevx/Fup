// Caminho: supabase/functions/enviar-notificacao/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Permite requisições do navegador (CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, usuario_envio, destinatario } = await req.json();

    // Define o destinatário fixo solicitado ou usa o que veio do front
    const emailDestino = "001827@conipaind.com.br";

    // Monta as linhas da tabela
    const tableRows = items.map((item: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.codigo || 'N/A'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>${item.equipamento}</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.req_me || '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.nf || '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.qtd || '-'}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.setor}</td>
      </tr>
    `).join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #E67E22;">Nova Solicitação de Cadastro de Ativo</h2>
        <p>Olá,</p>
        <p>O usuário <strong>${usuario_envio}</strong> registrou novos itens no sistema FUP ALM.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">CÓD</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">EQUIPAMENTO</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">REQ</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">NF</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">QTD</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">SETOR</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
        
        <p style="margin-top: 20px; font-size: 12px; color: #666;">Enviado via Sistema FUP.</p>
      </div>
    `;

    const data = await resend.emails.send({
      from: "Notificação FUP <onboarding@resend.dev>",
      to: [emailDestino],
      subject: `FUP: Novos Ativos Cadastrados (${items.length})`,
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