# Recorta silencios del locutor y genera timing.js con los tiempos de cada frase.
import sys, json, numpy as np, soundfile as sf
src, segs_json, out_wav, out_js = sys.argv[1:5]
TEXT = ["Onde você vai nascer dessa vez?","Japão.","Na cidade de Tóquio.","Só 1 em cada 190 bebês do mundo nasce aqui.","E esse número cai todo ano.","Você é o Haruto.","Nasceu na maior cidade do mundo:","37 milhões de pessoas na Grande Tóquio.","Aos seis, você vai pra escola…","sozinho.","De metrô.","No fim da aula, ninguém vai embora:","você e seus amigos limpam a escola.","Uma vez por mês,","treino de terremoto.","Aqui acontecem 1 em cada 5 terremotos fortes do planeta.","Chega um aluno novo:","o Lucas.","Brasileiro.","O bisavô dele saiu do Japão em 1908, rumo a Santos.","Hoje o Brasil tem a maior comunidade japonesa fora do Japão.","E o Lucas fez o caminho de volta.","Ele te ensina uma palavra que não tem tradução:","Saudade.","Dezoito.","A prova.","Quase 500 mil jovens fazem o vestibular nacional.","Você não passa.","Quem repete aqui vira rōnin:","samurai sem mestre.","No ano seguinte…","você passa.","Primeiro emprego.","Trem das 7h12.","Não das 7h13.","Estação de Shinjuku:","3,5 milhões de pessoas por dia.","Um dia, o trem sai 20 segundos adiantado.","E a empresa pede desculpas públicas.","Você trabalha tanto que dorme em pé no trem.","Aqui isso tem nome:","inemuri.","No Japão, Natal é coisa de casal…","e a ceia é frango do KFC.","Encomendado semanas antes.","Um filho.","Só um.","No mercado, você repara:","aqui se vende mais fralda geriátrica que fralda de bebê.","Na primavera, você vê as cerejeiras com o seu neto.","No Japão,","um homem vive em média 81 anos.","Você chega aos 100.","E o governo te dá um copo de saquê de prata.","Pela primeira vez na vida…","você se atrasou.","Últimas palavras do Haruto?","Saudade.","Onde você vai nascer da próxima vez?"]
a, sr = sf.read(src, dtype="float32")
segs = [{"s": 0.0, "e": 1.665}] + json.load(open(segs_json))
assert len(segs) == len(TEXT), (len(segs), len(TEXT))
PAD, GAP, LEAD = 0.035, 0.10, 0.12
keep = {0: segs[1]["s"] - segs[0]["e"], 1: segs[2]["s"] - segs[1]["e"]}  # pausas del gancho
out = [np.zeros(int(LEAD * sr), np.float32)]; t = LEAD; timing = []
for i, sg in enumerate(segs):
    s0 = max(0, sg["s"] - PAD); e0 = min(len(a) / sr, sg["e"] + PAD)
    chunk = a[int(s0 * sr):int(e0 * sr)].copy()
    f = int(0.008 * sr); chunk[:f] *= np.linspace(0, 1, f); chunk[-f:] *= np.linspace(1, 0, f)
    timing.append({"s": round(t + PAD, 3), "e": round(t + len(chunk) / sr - PAD, 3), "text": TEXT[i]})
    out.append(chunk); t += len(chunk) / sr
    if i < len(segs) - 1:
        g = keep.get(i, GAP); out.append(np.zeros(int(g * sr), np.float32)); t += g
out.append(np.zeros(int(0.9 * sr), np.float32)); t += 0.9
y = np.concatenate(out); y = y / max(1e-6, np.abs(y).max()) * 0.89
sf.write(out_wav, y, sr)
open(out_js, "w").write("window.T=" + json.dumps(timing, ensure_ascii=False) + ";window.TOTAL=" + str(round(len(y) / sr, 3)) + ";")
print("total", round(len(y) / sr, 2))
