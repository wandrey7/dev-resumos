import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categoria, Tecnologia, Conteudo, ExemploCodigo, Usuario } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class DadosService {
  private categoriasSubject = new BehaviorSubject<Categoria[]>([
    {
      id: 'cat-1',
      nome: 'Linguagens',
      slug: 'linguagens',
      descricao: 'Linguagens de programação para desenvolvimento de software, aplicações web, mobile e sistemas.',
      icone: 'code',
      ordem: 1
    },
    {
      id: 'cat-2',
      nome: 'Desenvolvimento',
      slug: 'desenvolvimento',
      descricao: 'Conceitos, tipagens avançadas, arquitetura e fundamentos de engenharia de software.',
      icone: 'cpu',
      ordem: 2
    },
    {
      id: 'cat-3',
      nome: 'Banco de Dados',
      slug: 'banco-de-dados',
      descricao: 'Sistemas gerenciadores de banco de dados relacionais e NoSQL, sintaxe SQL e modelagem.',
      icone: 'database',
      ordem: 3
    },
    {
      id: 'cat-4',
      nome: 'Ferramentas',
      slug: 'ferramentas',
      descricao: 'Controle de versão, containers, empacotadores e utilitários indispensáveis do fluxo dev.',
      icone: 'tool',
      ordem: 4
    },
    {
      id: 'cat-5',
      nome: 'Frameworks',
      slug: 'frameworks',
      descricao: 'Frameworks robustos para construção de interfaces web, APIs escaláveis e ecossistemas.',
      icone: 'layers',
      ordem: 5
    },
    {
      id: 'cat-6',
      nome: 'Web',
      slug: 'web',
      descricao: 'Padrões web, ecossistema do navegador, JavaScript moderno, APIs e estilização.',
      icone: 'globe',
      ordem: 6
    }
  ]);

  private tecnologiasSubject = new BehaviorSubject<Tecnologia[]>([
    {
      id: 'tec-java',
      nome: 'Java',
      slug: 'java',
      descricao: 'Linguagem orientada a objetos, robusta, amplamente utilizada em aplicações corporativas e Android.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: true,
      recente: false,
      icone: 'coffee',
      resumo: 'Java é uma linguagem de programação orientada a objetos de propósito geral, baseada em classes e projetada para ter o mínimo possível de dependências de implementação. Seu lema tradicional é "escreva uma vez, execute em qualquer lugar" (WORA), graças à Java Virtual Machine (JVM).',
      versao: 'Java 21 LTS'
    },
    {
      id: 'tec-python',
      nome: 'Python',
      slug: 'python',
      descricao: 'Linguagem de alto nível com sintaxe elegante, dominante em automação, ciência de dados e backend.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: true,
      recente: false,
      icone: 'terminal',
      resumo: 'Python é uma linguagem dinâmica de alto nível focada em legibilidade e produtividade. Possui uma comunidade massiva e bibliotecas abrangentes para Machine Learning, desenvolvimento web, scripts de infraestrutura e análise de dados.',
      versao: 'Python 3.12+'
    },
    {
      id: 'tec-c',
      nome: 'C',
      slug: 'c',
      descricao: 'Linguagem compilada de propósito geral, muito usada em sistemas operacionais e software de baixo nível.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: false,
      recente: true,
      icone: 'code',
      resumo: 'C é uma linguagem compilada que oferece controle direto sobre memória e recursos do sistema, sendo amplamente usada em sistemas operacionais, sistemas embarcados e aplicações de alto desempenho.',
      versao: 'C23'
    },
    {
      id: 'tec-cpp',
      nome: 'C++',
      slug: 'cpp',
      descricao: 'Linguagem de alto desempenho que combina recursos de baixo nível e programação orientada a objetos.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: true,
      recente: true,
      icone: 'code',
      resumo: 'C++ amplia C com recursos como classes, templates e abstrações de alto nível, mantendo controle de desempenho usado em jogos, aplicações gráficas e sistemas.',
      versao: 'C++23'
    },
    {
      id: 'tec-csharp',
      nome: 'C#',
      slug: 'csharp',
      descricao: 'Linguagem moderna da plataforma .NET para aplicações web, desktop, serviços e jogos.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: true,
      recente: true,
      icone: 'code',
      resumo: 'C# é uma linguagem fortemente tipada e orientada a objetos, integrada ao ecossistema .NET para criar aplicações web, serviços, ferramentas desktop e jogos com Unity.',
      versao: 'C# 13'
    },
    {
      id: 'tec-go',
      nome: 'Go',
      slug: 'go',
      descricao: 'Linguagem compilada com suporte nativo à concorrência, popular em serviços e infraestrutura.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: false,
      recente: true,
      icone: 'code',
      resumo: 'Go é uma linguagem compilada desenvolvida no Google, com sintaxe enxuta e goroutines para concorrência. É bastante usada em APIs, ferramentas de infraestrutura e serviços distribuídos.',
      versao: 'Go 1.24'
    },
    {
      id: 'tec-rust',
      nome: 'Rust',
      slug: 'rust',
      descricao: 'Linguagem de sistemas focada em desempenho e segurança de memória sem garbage collector.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: false,
      recente: true,
      icone: 'code',
      resumo: 'Rust combina desempenho próximo ao de C e C++ com garantias de segurança de memória verificadas em tempo de compilação, sendo usada em ferramentas, infraestrutura e sistemas.',
      versao: 'Rust 2024 Edition'
    },
    {
      id: 'tec-kotlin',
      nome: 'Kotlin',
      slug: 'kotlin',
      descricao: 'Linguagem concisa e interoperável com Java, amplamente utilizada no desenvolvimento Android.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: false,
      recente: true,
      icone: 'code',
      resumo: 'Kotlin é uma linguagem estaticamente tipada que roda na JVM e interoperá com Java. É uma das linguagens recomendadas para desenvolvimento Android moderno.',
      versao: 'Kotlin 2.1'
    },
    {
      id: 'tec-php',
      nome: 'PHP',
      slug: 'php',
      descricao: 'Linguagem de script muito usada no desenvolvimento web do lado do servidor.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: false,
      recente: true,
      icone: 'code',
      resumo: 'PHP é uma linguagem de script voltada principalmente à web, executada no servidor e usada em aplicações, APIs e sistemas de gerenciamento de conteúdo.',
      versao: 'PHP 8.4'
    },
    {
      id: 'tec-ruby',
      nome: 'Ruby',
      slug: 'ruby',
      descricao: 'Linguagem dinâmica conhecida por sua sintaxe expressiva e pelo framework Ruby on Rails.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: false,
      recente: true,
      icone: 'code',
      resumo: 'Ruby é uma linguagem dinâmica orientada a objetos, projetada para favorecer legibilidade e produtividade. Seu ecossistema inclui o framework web Ruby on Rails.',
      versao: 'Ruby 3.4'
    },
    {
      id: 'tec-swift',
      nome: 'Swift',
      slug: 'swift',
      descricao: 'Linguagem compilada da Apple para desenvolver aplicativos para iOS, macOS e outras plataformas.',
      categoriaId: 'cat-1',
      categoriaNome: 'Linguagens',
      popular: false,
      recente: true,
      icone: 'code',
      resumo: 'Swift é uma linguagem moderna e estaticamente tipada, desenvolvida pela Apple para aplicações em iOS, macOS, watchOS e demais plataformas do ecossistema.',
      versao: 'Swift 6'
    },
    {
      id: 'tec-sql',
      nome: 'SQL',
      slug: 'sql',
      descricao: 'Linguagem padrão declarativa para manipulação e consulta a bancos de dados relacionais.',
      categoriaId: 'cat-3',
      categoriaNome: 'Banco de Dados',
      popular: true,
      recente: false,
      icone: 'database',
      resumo: 'Structured Query Language (SQL) é a linguagem declarativa padrão universal para consultar, atualizar, gerenciar e estruturar bancos de dados relacionais (RDBMS).',
      versao: 'ANSI SQL:2023'
    },
    {
      id: 'tec-js',
      nome: 'JavaScript',
      slug: 'javascript',
      descricao: 'A linguagem fundamental da Web moderna, suportando paradigmas funcionais e orientados a objetos.',
      categoriaId: 'cat-6',
      categoriaNome: 'Web',
      popular: true,
      recente: false,
      icone: 'globe',
      resumo: 'JavaScript é a linguagem de programação de scripts mais popular do mundo, executada nativamente nos navegadores web e em servidores via Node.js, com suporte assíncrono avançado.',
      versao: 'ECMAScript 2024'
    },
    {
      id: 'tec-git',
      nome: 'Git',
      slug: 'git',
      descricao: 'Sistema de controle de versão distribuído rápido e versátil para histórico e colaboração.',
      categoriaId: 'cat-4',
      categoriaNome: 'Ferramentas',
      popular: true,
      recente: false,
      icone: 'git-branch',
      resumo: 'Git é o padrão da indústria para controle de versão distribuído de código-fonte. Permite rastrear alterações, criar ramificações paralelas (branches) e colaborar com segurança.',
      versao: 'Git 2.45+'
    },
    {
      id: 'tec-angular',
      nome: 'Angular',
      slug: 'angular',
      descricao: 'Plataforma corporativa moderna do Google para aplicações web escaláveis com TypeScript.',
      categoriaId: 'cat-5',
      categoriaNome: 'Frameworks',
      popular: true,
      recente: true,
      icone: 'shield',
      resumo: 'Angular é o framework web do Google estruturado para engenharia corporativa, trazendo componentes standalone, controle reativo via Signals, formulários avançados e roteamento robusto nativo.',
      versao: 'Angular 19+'
    },
    {
      id: 'tec-ts',
      nome: 'TypeScript',
      slug: 'typescript',
      descricao: 'Superset tipado do JavaScript que compila para JavaScript limpo, garantindo segurança em escala.',
      categoriaId: 'cat-2',
      categoriaNome: 'Desenvolvimento',
      popular: false,
      recente: true,
      icone: 'code',
      resumo: 'TypeScript adiciona tipagem estática e segurança de tipos em tempo de compilação ao JavaScript, prevenindo erros em runtime e potencializando a experiência em IDEs modernas.',
      versao: 'TypeScript 5.7'
    },
    {
      id: 'tec-docker',
      nome: 'Docker',
      slug: 'docker',
      descricao: 'Plataforma para empacotamento, distribuição e execução uniforme de aplicações em containers isolados.',
      categoriaId: 'cat-4',
      categoriaNome: 'Ferramentas',
      popular: false,
      recente: true,
      icone: 'box',
      resumo: 'Docker revoluciona a infraestrutura permitindo que desenvolvedores empacotem um aplicativo com todas as suas dependências em um container padronizado e imutável.',
      versao: 'Docker Engine 26+'
    },
    {
      id: 'tec-postgres',
      nome: 'PostgreSQL',
      slug: 'postgresql',
      descricao: 'Sistema gerenciador de banco de dados relacional e objeto-relacional avançado e confiável.',
      categoriaId: 'cat-3',
      categoriaNome: 'Banco de Dados',
      popular: false,
      recente: true,
      icone: 'server',
      resumo: 'PostgreSQL é um dos bancos de dados relacionais open-source mais avançados, oferecendo conformidade ACID, indexação sofisticada (B-Tree, GIN, GiST) e suporte nativo a JSONB.',
      versao: 'PostgreSQL 16'
    },
    {
      id: 'tec-react',
      nome: 'React',
      slug: 'react',
      descricao: 'Biblioteca declarativa e baseada em componentes reutilizáveis para construção de interfaces web.',
      categoriaId: 'cat-5',
      categoriaNome: 'Frameworks',
      popular: false,
      recente: false,
      icone: 'atom',
      resumo: 'React é uma biblioteca desenvolvida pela Meta focada na criação de interfaces de usuário reativas a partir de árvores de componentes modulares com gerenciamento de estado.',
      versao: 'React 19'
    }
  ]);

  private conteudosSubject = new BehaviorSubject<Conteudo[]>([
    // JAVA CONTEÚDOS (11 assuntos obrigatórios)
    {
      id: 'cnt-java-1',
      tecnologiaId: 'tec-java',
      titulo: 'Introdução',
      slug: 'introducao',
      texto: 'Estrutura fundamental de uma classe executável em Java e o método principal (main). Todo código Java reside dentro de uma classe.',
      ordem: 1
    },
    {
      id: 'cnt-java-2',
      tecnologiaId: 'tec-java',
      titulo: 'Variáveis',
      slug: 'variaveis',
      texto: 'Declaração e inicialização de variáveis primitivas e de referência com tipagem estática e explícita.',
      ordem: 2
    },
    {
      id: 'cnt-java-3',
      tecnologiaId: 'tec-java',
      titulo: 'Tipos',
      slug: 'tipos',
      texto: 'Tipos primitivos (byte, short, int, long, float, double, char, boolean) versus tipos por referência como String e Wrappers.',
      ordem: 3
    },
    {
      id: 'cnt-java-4',
      tecnologiaId: 'tec-java',
      titulo: 'Operadores',
      slug: 'operadores',
      texto: 'Operadores aritméticos (+, -, *, /, %), relacionais (==, !=, >, <) e lógicos (&&, ||, !).',
      ordem: 4
    },
    {
      id: 'cnt-java-5',
      tecnologiaId: 'tec-java',
      titulo: 'Condicionais',
      slug: 'condicionais',
      texto: 'Estruturas de desvio condicional usando if, else if, else e switch statements com pattern matching moderno.',
      ordem: 5
    },
    {
      id: 'cnt-java-6',
      tecnologiaId: 'tec-java',
      titulo: 'Laços',
      slug: 'lacos',
      texto: 'Estruturas de repetição: for tradicional, for-each aprimorado, while e do-while.',
      ordem: 6
    },
    {
      id: 'cnt-java-7',
      tecnologiaId: 'tec-java',
      titulo: 'Arrays',
      slug: 'arrays',
      texto: 'Vetores de tamanho fixo e a coleção dinâmica ArrayList da API de Coleções do Java.',
      ordem: 7
    },
    {
      id: 'cnt-java-8',
      tecnologiaId: 'tec-java',
      titulo: 'Métodos',
      slug: 'metodos',
      texto: 'Definição de métodos, modificadores de acesso, tipos de retorno, parâmetros e sobrecarga.',
      ordem: 8
    },
    {
      id: 'cnt-java-9',
      tecnologiaId: 'tec-java',
      titulo: 'Classes',
      slug: 'classes',
      texto: 'Modelagem de classes com atributos encapsulados, construtores e métodos de acesso (getters e setters).',
      ordem: 9
    },
    {
      id: 'cnt-java-10',
      tecnologiaId: 'tec-java',
      titulo: 'Objetos',
      slug: 'objetos',
      texto: 'Instanciação de objetos na memória Heap usando a palavra-chave new e ciclo de vida do Garbage Collector.',
      ordem: 10
    },
    {
      id: 'cnt-java-11',
      tecnologiaId: 'tec-java',
      titulo: 'Herança',
      slug: 'heranca',
      texto: 'Reutilização e polimorfismo através de herança simples com extends, sobrescrita com @Override e super.',
      ordem: 11
    },

    // PYTHON CONTEÚDOS
    {
      id: 'cnt-py-1',
      tecnologiaId: 'tec-python',
      titulo: 'Introdução e Sintaxe',
      slug: 'introducao',
      texto: 'Sintaxe baseada em indentação, execução de scripts e o comando de saída print.',
      ordem: 1
    },
    {
      id: 'cnt-py-2',
      tecnologiaId: 'tec-python',
      titulo: 'Variáveis e Tipagem Dinâmica',
      slug: 'variaveis',
      texto: 'Declaração implícita sem palavras-chave, tipagem forte e dinâmica, e verificação com type().',
      ordem: 2
    },
    {
      id: 'cnt-py-3',
      tecnologiaId: 'tec-python',
      titulo: 'Condicionais',
      slug: 'condicionais',
      texto: 'Controle de fluxo limpo com if, elif e else sem parênteses obrigatórios.',
      ordem: 3
    },
    {
      id: 'cnt-py-4',
      tecnologiaId: 'tec-python',
      titulo: 'Estruturas de Repetição',
      slug: 'lacos',
      texto: 'Iteração fluida com loops for in range() e laços while com controle break e continue.',
      ordem: 4
    },
    {
      id: 'cnt-py-5',
      tecnologiaId: 'tec-python',
      titulo: 'Listas e Dicionários',
      slug: 'listas-dicionarios',
      texto: 'Manipulação de listas dinâmicas mutáveis e dicionários chave-valor de alta performance.',
      ordem: 5
    },
    {
      id: 'cnt-py-6',
      tecnologiaId: 'tec-python',
      titulo: 'Funções',
      slug: 'funcoes',
      texto: 'Definição de funções com a palavra-chave def, argumentos posicionais, nomeados e retorno múltiplo.',
      ordem: 6
    },
    {
      id: 'cnt-py-7',
      tecnologiaId: 'tec-python',
      titulo: 'Classes e Objetos',
      slug: 'classes',
      texto: 'Programação orientada a objetos com classes, método construtor __init__ e referência explícita self.',
      ordem: 7
    },

    // SQL CONTEÚDOS
    {
      id: 'cnt-sql-1',
      tecnologiaId: 'tec-sql',
      titulo: 'Consultas Básicas (SELECT)',
      slug: 'consultas-basicas',
      texto: 'Recuperação de colunas e registros em tabelas com comandos SELECT e filtros WHERE.',
      ordem: 1
    },
    {
      id: 'cnt-sql-2',
      tecnologiaId: 'tec-sql',
      titulo: 'Junções (JOINs)',
      slug: 'joins',
      texto: 'Combinação de dados relacionais entre múltiplas tabelas com INNER JOIN, LEFT JOIN e chaves estrangeiras.',
      ordem: 2
    },

    // JAVASCRIPT CONTEÚDOS
    {
      id: 'cnt-js-1',
      tecnologiaId: 'tec-js',
      titulo: 'Variáveis e Escopo',
      slug: 'variaveis',
      texto: 'Diferença entre let, const e var, escopo de bloco e imutabilidade de referências.',
      ordem: 1
    },
    {
      id: 'cnt-js-2',
      tecnologiaId: 'tec-js',
      titulo: 'Métodos de Array',
      slug: 'array-methods',
      texto: 'Operações funcionais puras em listas: map, filter, reduce, find e forEach.',
      ordem: 2
    },

    // GIT CONTEÚDOS
    {
      id: 'cnt-git-1',
      tecnologiaId: 'tec-git',
      titulo: 'Fluxo de Trabalho Diário',
      slug: 'fluxo-basico',
      texto: 'Comandos fundamentais para versionar alterações: status, add, commit e push.',
      ordem: 1
    },

    // ANGULAR CONTEÚDOS
    {
      id: 'cnt-ng-1',
      tecnologiaId: 'tec-angular',
      titulo: 'Componentes Standalone',
      slug: 'componentes',
      texto: 'Criação de componentes independentes modernos sem módulos, com diretivas importadas diretamente.',
      ordem: 1
    }
  ]);

  private exemplosSubject = new BehaviorSubject<ExemploCodigo[]>([
    // JAVA EXEMPLOS
    {
      id: 'ex-java-1',
      conteudoId: 'cnt-java-1',
      titulo: 'Classe Principal e Método Main',
      linguagem: 'java',
      codigo: `public class Principal {
    public static void main(String[] args) {
        System.out.println("Olá, DevResumos!");
    }
}`,
      explicacao: 'O ponto de entrada de qualquer aplicação Java de console é o método main público e estático.'
    },
    {
      id: 'ex-java-2',
      conteudoId: 'cnt-java-2',
      titulo: 'Declaração e Inicialização de Variáveis',
      linguagem: 'java',
      codigo: `// Variáveis solicitadas no protótipo
int idade = 34;
String nome = "Jorvane";
double salario = 4500.50;
boolean ativo = true;`,
      explicacao: 'Variáveis precisam de especificação explícita do tipo antes do identificador.'
    },
    {
      id: 'ex-java-3',
      conteudoId: 'cnt-java-3',
      titulo: 'Tipos Primitivos vs Objetos Wrapper',
      linguagem: 'java',
      codigo: `int numeroPrimitivo = 10;
Integer numeroWrapper = Integer.valueOf(numeroPrimitivo);

// Conversão de String para número
int parseado = Integer.parseInt("120");`,
      explicacao: 'Wrappers fornecem métodos utilitários e permitem usar tipos primitivos em Coleções genéricas.'
    },
    {
      id: 'ex-java-4',
      conteudoId: 'cnt-java-4',
      titulo: 'Operadores Aritméticos e Lógicos',
      linguagem: 'java',
      codigo: `int soma = 10 + 5;
boolean condicao = (idade >= 18) && (ativo == true);
int resto = 10 % 3; // 1`,
      explicacao: 'O operador % calcula o resto da divisão inteira. && avalia com curto-circuito lógico.'
    },
    {
      id: 'ex-java-5',
      conteudoId: 'cnt-java-5',
      titulo: 'Controle Condicional If-Else e Switch',
      linguagem: 'java',
      codigo: `if (idade >= 18) {
    System.out.println(nome + " é maior de idade.");
} else {
    System.out.println(nome + " é menor de idade.");
}

// Switch Expression moderna
String cargo = switch (nivel) {
    case 1 -> "Júnior";
    case 2 -> "Pleno";
    default -> "Sênior";
};`,
      explicacao: 'Switch expressions retornam valores de forma compacta e exaustiva.'
    },
    {
      id: 'ex-java-6',
      conteudoId: 'cnt-java-6',
      titulo: 'Laços de Repetição For e While',
      linguagem: 'java',
      codigo: `for (int i = 0; i < 5; i++) {
    System.out.println("Índice: " + i);
}

int contador = 0;
while (contador < 3) {
    contador++;
}`,
      explicacao: 'O for tradicional é ideal quando o número de iterações é previamente conhecido.'
    },
    {
      id: 'ex-java-7a',
      conteudoId: 'cnt-java-7',
      titulo: 'Criando um ArrayList',
      linguagem: 'java',
      codigo: `import java.util.ArrayList;
import java.util.List;

List<String> tecnologias = new ArrayList<>();`,
      explicacao: 'ArrayList cresce dinamicamente na memória Heap conforme novos elementos são adicionados.'
    },
    {
      id: 'ex-java-7b',
      conteudoId: 'cnt-java-7',
      titulo: 'Adicionando elementos',
      linguagem: 'java',
      codigo: `tecnologias.add("Java");
tecnologias.add("Python");
tecnologias.add("SQL");`,
      explicacao: 'O método .add() insere o item no fim da lista com complexidade O(1) amortizada.'
    },
    {
      id: 'ex-java-7c',
      conteudoId: 'cnt-java-7',
      titulo: 'Removendo elementos',
      linguagem: 'java',
      codigo: `// Remove pelo índice ou pelo próprio objeto
tecnologias.remove(0);
tecnologias.remove("SQL");`,
      explicacao: 'A remoção por índice desloca os elementos subsequentes para a esquerda.'
    },
    {
      id: 'ex-java-8',
      conteudoId: 'cnt-java-8',
      titulo: 'Método Executar e Retorno de Valores',
      linguagem: 'java',
      codigo: `public void executar() {
    // código a ser executado
    System.out.println("Executando rotina com sucesso...");
}

public int somar(int a, int b) {
    return a + b;
}`,
      explicacao: 'Métodos com void não retornam valor; métodos tipados exigem a instrução return.'
    },
    {
      id: 'ex-java-9',
      conteudoId: 'cnt-java-9',
      titulo: 'Declaração de Classe com Atributos',
      linguagem: 'java',
      codigo: `public class Desenvolvedor {
    private String nome;
    private int idade;

    public Desenvolvedor(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    public String getNome() { return this.nome; }
}`,
      explicacao: 'Encapsulamento restringe acesso direto aos atributos protegendo o estado do objeto.'
    },
    {
      id: 'ex-java-10',
      conteudoId: 'cnt-java-10',
      titulo: 'Instanciação com operador new',
      linguagem: 'java',
      codigo: `Desenvolvedor dev = new Desenvolvedor("Jorvane", 34);
dev.executar();`,
      explicacao: 'A palavra new aloca memória para uma nova instância e invoca o construtor.'
    },
    {
      id: 'ex-java-11',
      conteudoId: 'cnt-java-11',
      titulo: 'Herança com extends e @Override',
      linguagem: 'java',
      codigo: `public class DesenvolvedorSenior extends Desenvolvedor {
    public DesenvolvedorSenior(String nome, int idade) {
        super(nome, idade);
    }

    @Override
    public void executar() {
        super.executar();
        System.out.println("Aplicando padrões de arquitetura corporativa.");
    }
}`,
      explicacao: 'A anotação @Override garante que o método sobrescreve corretamente a assinatura da superclasse.'
    },

    // PYTHON EXEMPLOS
    {
      id: 'ex-py-1',
      conteudoId: 'cnt-py-1',
      titulo: 'Script Olá Mundo e Variáveis',
      linguagem: 'python',
      codigo: `nome = "Jorvane"
idade = 34
salario = 5200.75

print(f"Desenvolvedor {nome}, idade: {idade}")`,
      explicacao: 'As f-strings simplificam a interpolação direta de variáveis dentro de textos.'
    },
    {
      id: 'ex-py-2',
      conteudoId: 'cnt-py-2',
      titulo: 'Estruturas Condicionais',
      linguagem: 'python',
      codigo: `if idade >= 18:
    status = "Maior de idade"
elif idade > 12:
    status = "Adolescente"
else:
    status = "Criança"`,
      explicacao: 'A indentação padrão de 4 espaços define blocos sem uso de chaves.'
    },
    {
      id: 'ex-py-3',
      conteudoId: 'cnt-py-3',
      titulo: 'Listas e Adição de Elementos',
      linguagem: 'python',
      codigo: `linguagens = ["Python", "Java", "SQL"]
linguagens.append("TypeScript")

# Remoção de elemento
linguagens.remove("Java")`,
      explicacao: 'Listas em Python são heterogêneas e possuem suporte a fatiamento (slicing).'
    },
    {
      id: 'ex-py-4',
      conteudoId: 'cnt-py-4',
      titulo: 'Dicionários Chave-Valor',
      linguagem: 'python',
      codigo: `usuario = {
    "nome": "Jorvane",
    "idade": 34,
    "cargo": "Tech Lead"
}
print(usuario.get("cargo", "Indefinido"))`,
      explicacao: 'O método get evita KeyError caso a chave consultada não exista.'
    },
    {
      id: 'ex-py-5',
      conteudoId: 'cnt-py-5',
      titulo: 'Definição de Funções',
      linguagem: 'python',
      codigo: `def executar(tarefa: str = "Padrão") -> bool:
    print(f"Executando tarefa: {tarefa}")
    return True`,
      explicacao: 'Type hints são opcionais mas facilitam a validação por ferramentas estáticas.'
    },
    {
      id: 'ex-py-6',
      conteudoId: 'cnt-py-6',
      titulo: 'Classe em Python com __init__',
      linguagem: 'python',
      codigo: `class Dev:
    def __init__(self, nome: str, idade: int):
        self.nome = nome
        self.idade = idade

    def programar(self):
        print(f"{self.nome} está programando.")`,
      explicacao: 'O parâmetro self referencia a instância atual do objeto.'
    },

    // SQL EXEMPLOS
    {
      id: 'ex-sql-1',
      conteudoId: 'cnt-sql-1',
      titulo: 'Consulta Básica com Filtro e Ordenação',
      linguagem: 'sql',
      codigo: `SELECT id, nome, email, perfil
FROM usuarios
WHERE ativo = true AND idade >= 18
ORDER BY nome ASC
LIMIT 10;`,
      explicacao: 'A cláusula WHERE restringe as linhas retornadas antes da ordenação final.'
    },
    {
      id: 'ex-sql-2',
      conteudoId: 'cnt-sql-2',
      titulo: 'Junção com INNER JOIN',
      linguagem: 'sql',
      codigo: `SELECT t.nome AS tecnologia, c.nome AS categoria
FROM tecnologias t
INNER JOIN categorias c ON t.categoria_id = c.id
WHERE c.slug = 'linguagens';`,
      explicacao: 'INNER JOIN combina apenas as linhas com correspondência em ambas as tabelas.'
    },

    // JAVASCRIPT EXEMPLOS
    {
      id: 'ex-js-1',
      conteudoId: 'cnt-js-1',
      titulo: 'Declarações com let e const',
      linguagem: 'javascript',
      codigo: `const NOME_SISTEMA = "DevResumos";
let totalConsultas = 0;
totalConsultas += 1;`,
      explicacao: 'const impede a reatribuição da variável no mesmo escopo léxico.'
    },
    {
      id: 'ex-js-2',
      conteudoId: 'cnt-js-2',
      titulo: 'Métodos de Array: map, filter e reduce',
      linguagem: 'javascript',
      codigo: `const linguagens = ["Java", "Python", "SQL", "JavaScript"];

// Filtrar itens com mais de 4 caracteres
const longas = linguagens.filter(lang => lang.length > 4);

// Transformar em maiúsculas
const maiusculas = linguagens.map(lang => lang.toUpperCase());`,
      explicacao: 'Métodos funcionais retornam novos arrays sem modificar a lista original.'
    },

    // GIT EXEMPLOS
    {
      id: 'ex-git-1',
      conteudoId: 'cnt-git-1',
      titulo: 'Comandos Básicos de Salvamento',
      linguagem: 'bash',
      codigo: `git status
git add .
git commit -m "feat: adiciona modulo de resumos"
git push origin main`,
      explicacao: 'git add indexa as modificações no stage para serem consolidadas no commit.'
    },

    // ANGULAR EXEMPLOS
    {
      id: 'ex-ng-1',
      conteudoId: 'cnt-ng-1',
      titulo: 'Componente Standalone com Injeção de Dependência',
      linguagem: 'typescript',
      codigo: `@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: \`<div class="card">{{ titulo }}</div>\`
})
export class CardComponent {
  @Input({ required: true }) titulo!: string;
}`,
      explicacao: 'Componentes standalone eliminam a necessidade de NgModules intermediários.'
    }
  ]);

  private usuariosSubject = new BehaviorSubject<Usuario[]>([
    {
      id: 'usr-admin',
      nome: 'Administrador Dev',
      email: 'admin@devresumos.com.br',
      perfil: 'admin',
      senha: 'password123',
      criadoEm: '2026-01-15'
    },
    {
      id: 'usr-dev',
      nome: 'Jorvane Silva',
      email: 'jorvane@devresumos.com.br',
      perfil: 'usuario',
      senha: 'password123',
      criadoEm: '2026-02-10'
    }
  ]);

  constructor() {
    this.restaurarLista('devresumos_categorias', this.categoriasSubject);
    this.restaurarLista('devresumos_tecnologias', this.tecnologiasSubject);
    this.restaurarLista('devresumos_conteudos', this.conteudosSubject);
    this.restaurarLista('devresumos_exemplos', this.exemplosSubject);
    this.restaurarLista('devresumos_usuarios', this.usuariosSubject);
  }

  private restaurarLista<T>(chave: string, subject: BehaviorSubject<T[]>): void {
    if (typeof window === 'undefined') return;

    try {
      const salvo = window.localStorage.getItem(chave);
      if (!salvo) return;
      const dados: unknown = JSON.parse(salvo);
      if (!Array.isArray(dados)) {
        throw new Error(`Os dados salvos em "${chave}" não são uma lista.`);
      }
      subject.next(dados as T[]);
    } catch (error) {
      console.error(`Não foi possível restaurar "${chave}". Os dados iniciais serão usados.`, error);
      window.localStorage.removeItem(chave);
    }
  }

  private publicarLista<T>(chave: string, subject: BehaviorSubject<T[]>, lista: T[]): void {
    if (typeof window !== 'undefined') {
      try {
        const dados = chave === 'devresumos_usuarios'
          ? (lista as Usuario[]).map(({ senha: _senha, ...usuario }) => usuario)
          : lista;
        window.localStorage.setItem(chave, JSON.stringify(dados));
      } catch (error) {
        console.error(`Não foi possível salvar "${chave}".`, error);
        throw new Error('Não foi possível salvar os dados. Verifique o armazenamento do navegador e tente novamente.');
      }
    }
    subject.next(lista);
  }

  // Observables públicos
  readonly categorias$: Observable<Categoria[]> = this.categoriasSubject.asObservable();
  readonly tecnologias$: Observable<Tecnologia[]> = this.tecnologiasSubject.asObservable();
  readonly conteudos$: Observable<Conteudo[]> = this.conteudosSubject.asObservable();
  readonly exemplos$: Observable<ExemploCodigo[]> = this.exemplosSubject.asObservable();
  readonly usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

  // Snapshot helpers
  getCategorias(): Categoria[] {
    return this.categoriasSubject.getValue();
  }

  getCategoriaBySlug(slug: string): Categoria | undefined {
    return this.getCategorias().find(c => c.slug.toLowerCase() === slug.toLowerCase());
  }

  getTecnologias(): Tecnologia[] {
    return this.tecnologiasSubject.getValue();
  }

  getTecnologiasPopulares(): Tecnologia[] {
    return this.getTecnologias().filter(t => t.popular);
  }

  getTecnologiasRecentes(): Tecnologia[] {
    return this.getTecnologias().filter(t => t.recente);
  }

  getTecnologiaBySlug(slug: string): Tecnologia | undefined {
    return this.getTecnologias().find(t => t.slug.toLowerCase() === slug.toLowerCase());
  }

  getTecnologiasByCategoriaId(categoriaId: string): Tecnologia[] {
    return this.getTecnologias().filter(t => t.categoriaId === categoriaId);
  }

  getConteudosByTecnologiaId(tecnologiaId: string): Conteudo[] {
    return this.conteudosSubject.getValue()
      .filter(c => c.tecnologiaId === tecnologiaId)
      .sort((a, b) => a.ordem - b.ordem);
  }

  getExemplosByConteudoId(conteudoId: string): ExemploCodigo[] {
    return this.exemplosSubject.getValue().filter(e => e.conteudoId === conteudoId);
  }

  getUsuarios(): Usuario[] {
    return this.usuariosSubject.getValue();
  }

  // BUSCA INTELIGENTE IGNORANDO ACENTOS E MAIÚSCULAS
  buscar(termo: string) {
    const limpo = this.removerAcentos(termo.trim().toLowerCase());
    if (limpo.length < 2) return [];

    const resultados: {
      tecnologia: Tecnologia;
      assunto: Conteudo;
      topicos: { titulo: string; codigo?: string; snippet: string }[];
    }[] = [];

    const tecnologias = this.getTecnologias();
    const conteudos = this.conteudosSubject.getValue();
    const exemplos = this.exemplosSubject.getValue();

    for (const tec of tecnologias) {
      const tecNomeLimpo = this.removerAcentos(tec.nome.toLowerCase());
      const tecConteudos = conteudos.filter(c => c.tecnologiaId === tec.id);

      for (const cnt of tecConteudos) {
        const cntTituloLimpo = this.removerAcentos(cnt.titulo.toLowerCase());
        const cntTextoLimpo = this.removerAcentos(cnt.texto.toLowerCase());
        const cntExemplos = exemplos.filter(e => e.conteudoId === cnt.id);

        const topicosRelevantes: { titulo: string; codigo?: string; snippet: string }[] = [];

        // Verifica exemplos
        for (const ex of cntExemplos) {
          const exTituloLimpo = this.removerAcentos(ex.titulo.toLowerCase());
          const exCodigoLimpo = this.removerAcentos(ex.codigo.toLowerCase());
          const exExpLimpo = this.removerAcentos((ex.explicacao || '').toLowerCase());

          if (
            exTituloLimpo.includes(limpo) ||
            exCodigoLimpo.includes(limpo) ||
            exExpLimpo.includes(limpo) ||
            cntTituloLimpo.includes(limpo) ||
            tecNomeLimpo.includes(limpo)
          ) {
            topicosRelevantes.push({
              titulo: ex.titulo,
              codigo: ex.codigo,
              snippet: ex.explicacao || ex.codigo.split('\n')[0]
            });
          }
        }

        // Se encontrou exemplos relevantes ou se o próprio assunto deu match
        if (
          topicosRelevantes.length > 0 ||
          cntTituloLimpo.includes(limpo) ||
          cntTextoLimpo.includes(limpo)
        ) {
          if (topicosRelevantes.length === 0) {
            topicosRelevantes.push({
              titulo: cnt.titulo,
              snippet: cnt.texto
            });
          }

          resultados.push({
            tecnologia: tec,
            assunto: cnt,
            topicos: topicosRelevantes
          });
        }
      }
    }

    return resultados;
  }

  private removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // CRUD TECNOLOGIAS
  salvarTecnologia(tec: Partial<Tecnologia>): Tecnologia {
    const list = [...this.tecnologiasSubject.getValue()];
    const cat = this.getCategorias().find(c => c.id === tec.categoriaId);
    if (tec.id) {
      const idx = list.findIndex(item => item.id === tec.id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...tec,
          categoriaNome: cat?.nome || list[idx].categoriaNome
        } as Tecnologia;
        this.publicarLista('devresumos_tecnologias', this.tecnologiasSubject, list);
        return list[idx];
      }
    }
    const nova: Tecnologia = {
      id: 'tec-' + Date.now(),
      nome: tec.nome || 'Nova Tecnologia',
      slug: (tec.slug || tec.nome || 'nova').toLowerCase().replace(/\s+/g, '-'),
      descricao: tec.descricao || '',
      categoriaId: tec.categoriaId || this.getCategorias()[0]?.id || '',
      categoriaNome: cat?.nome || 'Geral',
      popular: tec.popular ?? false,
      recente: tec.recente ?? true,
      resumo: tec.resumo || tec.descricao,
      versao: tec.versao || '1.0'
    };
    list.unshift(nova);
    this.publicarLista('devresumos_tecnologias', this.tecnologiasSubject, list);
    return nova;
  }

  excluirTecnologia(id: string) {
    const conteudosRemovidos = this.conteudosSubject.getValue().filter(c => c.tecnologiaId === id);
    const idsConteudos = new Set(conteudosRemovidos.map(c => c.id));
    const conteudos = this.conteudosSubject.getValue().filter(c => c.tecnologiaId !== id);
    const exemplos = this.exemplosSubject.getValue().filter(e => !idsConteudos.has(e.conteudoId));
    const tecnologias = this.tecnologiasSubject.getValue().filter(t => t.id !== id);

    this.publicarLista('devresumos_conteudos', this.conteudosSubject, conteudos);
    this.publicarLista('devresumos_exemplos', this.exemplosSubject, exemplos);
    this.publicarLista('devresumos_tecnologias', this.tecnologiasSubject, tecnologias);
  }

  // CRUD CATEGORIAS
  salvarCategoria(cat: Partial<Categoria>): Categoria {
    const list = [...this.categoriasSubject.getValue()];
    if (cat.id) {
      const idx = list.findIndex(item => item.id === cat.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...cat } as Categoria;
        const tecnologias = this.tecnologiasSubject.getValue().map(tecnologia =>
          tecnologia.categoriaId === cat.id
            ? { ...tecnologia, categoriaNome: list[idx].nome }
            : tecnologia
        );
        this.publicarLista('devresumos_tecnologias', this.tecnologiasSubject, tecnologias);
        this.publicarLista('devresumos_categorias', this.categoriasSubject, list);
        return list[idx];
      }
    }
    const nova: Categoria = {
      id: 'cat-' + Date.now(),
      nome: cat.nome || 'Nova Categoria',
      slug: (cat.slug || cat.nome || 'nova').toLowerCase().replace(/\s+/g, '-'),
      descricao: cat.descricao || 'Descrição da categoria',
      icone: cat.icone || 'folder',
      ordem: list.length + 1
    };
    list.push(nova);
    this.publicarLista('devresumos_categorias', this.categoriasSubject, list);
    return nova;
  }

  excluirCategoria(id: string): boolean {
    if (this.tecnologiasSubject.getValue().some(t => t.categoriaId === id)) return false;
    const list = this.categoriasSubject.getValue().filter(c => c.id !== id);
    this.publicarLista('devresumos_categorias', this.categoriasSubject, list);
    return true;
  }

  // CRUD CONTEÚDOS
  salvarConteudo(cnt: Partial<Conteudo>): Conteudo {
    const list = [...this.conteudosSubject.getValue()];
    if (cnt.id) {
      const idx = list.findIndex(item => item.id === cnt.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...cnt } as Conteudo;
        this.publicarLista('devresumos_conteudos', this.conteudosSubject, list);
        return list[idx];
      }
    }
    const novo: Conteudo = {
      id: 'cnt-' + Date.now(),
      tecnologiaId: cnt.tecnologiaId || this.getTecnologias()[0]?.id || '',
      titulo: cnt.titulo || 'Novo Assunto',
      slug: (cnt.slug || cnt.titulo || 'assunto').toLowerCase().replace(/\s+/g, '-'),
      texto: cnt.texto || '',
      ordem: cnt.ordem || (list.length + 1)
    };
    list.push(novo);
    this.publicarLista('devresumos_conteudos', this.conteudosSubject, list);
    return novo;
  }

  excluirConteudo(id: string) {
    const list = this.conteudosSubject.getValue().filter(c => c.id !== id);
    const exemplos = this.exemplosSubject.getValue().filter(e => e.conteudoId !== id);
    this.publicarLista('devresumos_exemplos', this.exemplosSubject, exemplos);
    this.publicarLista('devresumos_conteudos', this.conteudosSubject, list);
  }

  // CRUD EXEMPLOS
  salvarExemplo(ex: Partial<ExemploCodigo>): ExemploCodigo {
    const list = [...this.exemplosSubject.getValue()];
    if (ex.id) {
      const idx = list.findIndex(item => item.id === ex.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...ex } as ExemploCodigo;
        this.publicarLista('devresumos_exemplos', this.exemplosSubject, list);
        return list[idx];
      }
    }
    const novo: ExemploCodigo = {
      id: 'ex-' + Date.now(),
      conteudoId: ex.conteudoId || this.conteudosSubject.getValue()[0]?.id || '',
      titulo: ex.titulo || 'Novo Exemplo',
      linguagem: ex.linguagem || 'java',
      codigo: ex.codigo || '// código',
      explicacao: ex.explicacao || ''
    };
    list.push(novo);
    this.publicarLista('devresumos_exemplos', this.exemplosSubject, list);
    return novo;
  }

  excluirExemplo(id: string) {
    const list = this.exemplosSubject.getValue().filter(e => e.id !== id);
    this.publicarLista('devresumos_exemplos', this.exemplosSubject, list);
  }

  // CRUD USUÁRIOS
  salvarUsuario(usr: Partial<Usuario>): Usuario {
    const list = [...this.usuariosSubject.getValue()];
    if (usr.id) {
      const idx = list.findIndex(item => item.id === usr.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...usr } as Usuario;
        this.publicarLista('devresumos_usuarios', this.usuariosSubject, list);
        return list[idx];
      }
    }
    const novo: Usuario = {
      id: 'usr-' + Date.now(),
      nome: usr.nome || 'Novo Usuário',
      email: usr.email || '',
      perfil: usr.perfil || 'usuario',
      criadoEm: new Date().toISOString().split('T')[0]
    };
    list.push(novo);
    this.publicarLista('devresumos_usuarios', this.usuariosSubject, list);
    return novo;
  }

  excluirUsuario(id: string) {
    const list = this.usuariosSubject.getValue().filter(u => u.id !== id);
    this.publicarLista('devresumos_usuarios', this.usuariosSubject, list);
  }
}
