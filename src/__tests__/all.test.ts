import { Page } from "puppeteer";

function eqSet(as: Set<string>, bs: Set<string>) {
  if (as.size !== bs.size) return false;
  for (let a of as) if (!bs.has(a)) return false;
  return true;
}

describe("Browserfight", () => {
  // let serverId: string;
  let clientURL: string;
  let clientId: string;

  let serverPage: Page;
  let clientPage: Page;

  beforeEach(async () => {

    serverPage = await browser.newPage();
    await serverPage.goto("http://localhost:3000");

    await serverPage.waitForSelector("#start-game");
    serverPage.click("#start-game");

    await serverPage.waitForSelector("#client-url");
    const URLElement = await serverPage.$("#client-url");
    clientURL = await (await URLElement.getProperty("textContent")).jsonValue();

    clientPage = await browser.newPage();
    await clientPage.goto(clientURL);

  });

  afterEach(() => {
    serverPage.close();
    clientPage.close();
  })

  it("Server should start successfully", () => {
    expect(clientURL).toMatch("http://localhost:3000/");
  });


  it('The client page opened succesfullly', async () => {
    await clientPage.waitForSelector("#client-id");
    const clientIdElement = await clientPage.$("#client-id");
    clientId = await (await clientIdElement.getProperty("textContent")).jsonValue();

    expect(typeof clientId).toBe('string');
    expect(clientURL).toMatch("http://localhost:3000/");
  })

  describe('Console debugs', () => {

    let serverMessages = new Set([
      'Connection to client established',
      'Received handshake from client: Hello from client',
    ])
    let seenServerMessages = new Set();

    let clientMessages = new Set([
      'Connection to server established',
      'Received handshake from server: Hello from server',
    ])
    let seenClientMessages = new Set();

    it('Check all server messages', async (done) => {
      serverPage.on('console', async msg => {
        if (msg.type() === 'debug') {
          console.log(await msg.args()[0].jsonValue());
          const text = msg.text();
          expect(serverMessages).toContain(text);
          seenServerMessages.add(text);
          if (eqSet(serverMessages, seenServerMessages)) {
            done()
          }
        }
      });
    });

    it('Check all client messages', (done) => {
      clientPage.on('console', msg => {
        if (msg.type() === 'debug') {
          const text = msg.text();
          expect(clientMessages).toContain(text);
          seenClientMessages.add(text);
          if (eqSet(clientMessages, seenClientMessages)) {
            done()
          }
        }
      });
    });

    // Make sure this test comes last
    it('Check which messages have not been seen', () => {
      expect(seenServerMessages).toEqual(serverMessages)
    })

  })
});

export { };
